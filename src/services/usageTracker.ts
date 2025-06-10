
import { supabase } from '@/integrations/supabase/client';
import { anonymousUsageTracker } from './anonymousUsageTracker';

interface UsageData {
  toolId: string;
  inputData: string;
  success: boolean;
  executionTime?: number;
  resultData?: any;
  errorMessage?: string;
  userPlan?: string;
}

interface UsageLimitResult {
  canUse: boolean;
  used: number;
  limit: number;
  remaining?: number;
}

export const trackToolUsage = async (data: UsageData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Track anonymous usage via MySQL backend
      console.log('Tracking anonymous usage via MySQL backend');
      await anonymousUsageTracker.trackUsage({
        toolId: data.toolId,
        inputData: data.inputData,
        success: data.success,
        executionTime: data.executionTime,
        errorMessage: data.errorMessage
      });
      return;
    }

    // Store successful usage in Supabase tool_history table for authenticated users
    if (data.success) {
      const historyRecord = {
        user_id: user.id,
        tool_id: data.toolId,
        input_data: data.inputData,
        result_data: data.resultData
      };

      const { error } = await supabase
        .from('tool_history')
        .insert([historyRecord]);

      if (error) {
        console.error('Error tracking tool usage in Supabase history:', error);
      }
    }

    // Log all usage (successful and failed) to console for now
    console.log('Tool usage tracked for authenticated user:', {
      toolId: data.toolId,
      success: data.success,
      userPlan: data.userPlan,
      executionTime: data.executionTime
    });

  } catch (error) {
    console.error('Error in trackToolUsage:', error);
  }
};

export const updateDailyUsageLimit = async (toolId: string, increment = 1) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // For anonymous users, usage is already tracked in trackToolUsage
      console.log('Anonymous user daily usage updated via MySQL');
      return;
    }

    // For authenticated users, log the usage update
    console.log('Daily usage updated for authenticated user:', {
      userId: user.id,
      toolId,
      increment
    });

  } catch (error) {
    console.error('Error in updateDailyUsageLimit:', error);
  }
};

export const checkDailyUsageLimit = async (toolId: string): Promise<UsageLimitResult> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Check anonymous usage limits via MySQL backend
      console.log('Checking anonymous usage limit via MySQL backend');
      const result = await anonymousUsageTracker.checkUsageLimit(toolId);
      return {
        canUse: result.canUse,
        used: result.usedToday,
        limit: result.dailyLimit,
        remaining: result.remaining
      };
    }

    // For authenticated users, check Supabase limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count today's usage from tool_history
    const { count: todayUsage } = await supabase
      .from('tool_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .gte('created_at', today.toISOString());

    // Get user plan from auth metadata or default to free
    const userPlan = user.user_metadata?.plan || 'free';
    
    // Set limits based on plan
    let dailyLimit = 50; // Default for free users
    if (userPlan === 'pro') dailyLimit = 500;
    if (userPlan === 'enterprise') dailyLimit = -1; // Unlimited

    const used = todayUsage || 0;
    const canUse = dailyLimit === -1 || used < dailyLimit;
    const remaining = dailyLimit === -1 ? -1 : Math.max(0, dailyLimit - used);

    return { 
      canUse, 
      used, 
      limit: dailyLimit,
      remaining
    };
  } catch (error) {
    console.error('Error checking daily usage limit:', error);
    // Return conservative defaults on error
    return { canUse: false, used: 0, limit: 10 };
  }
};

export const getUsageStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Get anonymous usage stats from MySQL backend
      console.log('Getting anonymous usage stats');
      return await anonymousUsageTracker.getUsageStats();
    }

    // Get authenticated user stats from Supabase
    const { data: historyData } = await supabase
      .from('tool_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    return historyData || [];
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return [];
  }
};
