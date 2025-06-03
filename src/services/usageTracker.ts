
import { supabase } from '@/integrations/supabase/client';

interface UsageData {
  toolId: string;
  inputData: string;
  success: boolean;
  executionTime?: number;
  resultData?: any;
  errorMessage?: string;
  userPlan?: string;
}

export const trackToolUsage = async (data: UsageData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No user found for usage tracking');
      return;
    }

    // Store successful usage in tool_history table
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
        console.error('Error tracking tool usage in history:', error);
      }
    }

    // Log all usage (successful and failed) to console for now
    // In the future, you might want to create a separate table for detailed usage logs
    console.log('Tool usage tracked:', {
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
      return;
    }

    // For now, we'll just log the usage update
    // You can implement daily usage limits using the tool_history table
    console.log('Daily usage updated:', {
      userId: user.id,
      toolId,
      increment
    });

  } catch (error) {
    console.error('Error in updateDailyUsageLimit:', error);
  }
};

export const checkDailyUsageLimit = async (toolId: string): Promise<{ canUse: boolean; used: number; limit: number }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { canUse: false, used: 0, limit: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count today's usage from tool_history
    const { count: todayUsage } = await supabase
      .from('tool_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .gte('created_at', today.toISOString());

    const dailyLimit = 50; // Default daily limit
    const used = todayUsage || 0;
    const canUse = used < dailyLimit;

    return { 
      canUse, 
      used, 
      limit: dailyLimit 
    };
  } catch (error) {
    console.error('Error checking daily usage limit:', error);
    return { canUse: true, used: 0, limit: 50 };
  }
};
