
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

    const usageRecord = {
      user_id: user.id,
      tool_id: data.toolId,
      input_data: data.inputData,
      success: data.success,
      execution_time: data.executionTime,
      result_data: data.resultData,
      error_message: data.errorMessage,
      user_plan: data.userPlan || 'free'
    };

    const { error } = await supabase
      .from('tool_usage')
      .insert([usageRecord]);

    if (error) {
      console.error('Error tracking tool usage:', error);
    }
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

    const today = new Date().toISOString().split('T')[0];
    
    // Check if record exists for today
    const { data: existingRecord } = await supabase
      .from('daily_usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .eq('date', today)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('daily_usage_limits')
        .update({ 
          usage_count: existingRecord.usage_count + increment,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id);

      if (error) {
        console.error('Error updating daily usage:', error);
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('daily_usage_limits')
        .insert([{
          user_id: user.id,
          tool_id: toolId,
          date: today,
          usage_count: increment,
          limit_count: 50 // Default daily limit for free users
        }]);

      if (error) {
        console.error('Error creating daily usage record:', error);
      }
    }
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

    const today = new Date().toISOString().split('T')[0];
    
    const { data: usageRecord } = await supabase
      .from('daily_usage_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_id', toolId)
      .eq('date', today)
      .single();

    if (!usageRecord) {
      return { canUse: true, used: 0, limit: 50 };
    }

    const canUse = usageRecord.usage_count < usageRecord.limit_count;
    return { 
      canUse, 
      used: usageRecord.usage_count, 
      limit: usageRecord.limit_count 
    };
  } catch (error) {
    console.error('Error checking daily usage limit:', error);
    return { canUse: true, used: 0, limit: 50 };
  }
};
