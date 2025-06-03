
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageStats {
  queriesTotal: number;
  queriesToday: number;
  toolsUsed: number;
  successRate: number;
  dailyUsage: Array<{ date: string; count: number }>;
  topTools: Array<{ tool_id: string; count: number }>;
}

export const useUsageStats = () => {
  const [stats, setStats] = useState<UsageStats>({
    queriesTotal: 0,
    queriesToday: 0,
    toolsUsed: 0,
    successRate: 0,
    dailyUsage: [],
    topTools: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsageStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get total queries
        const { count: totalQueries } = await supabase
          .from('tool_usage')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get today's queries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayQueries } = await supabase
          .from('tool_usage')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());

        // Get unique tools used
        const { data: uniqueTools } = await supabase
          .from('tool_usage')
          .select('tool_id')
          .eq('user_id', user.id);

        const toolsUsedCount = new Set(uniqueTools?.map(t => t.tool_id) || []).size;

        // Get success rate
        const { count: successfulQueries } = await supabase
          .from('tool_usage')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('success', true);

        const successRate = totalQueries ? Math.round((successfulQueries || 0) / totalQueries * 100) : 0;

        // Get daily usage for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: dailyData } = await supabase
          .from('tool_usage')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());

        const dailyUsage = dailyData?.reduce((acc: any[], usage) => {
          const date = new Date(usage.created_at).toISOString().split('T')[0];
          const existing = acc.find(d => d.date === date);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ date, count: 1 });
          }
          return acc;
        }, []) || [];

        // Get top tools
        const { data: toolData } = await supabase
          .from('tool_usage')
          .select('tool_id')
          .eq('user_id', user.id);

        const toolCounts = toolData?.reduce((acc: any, usage) => {
          acc[usage.tool_id] = (acc[usage.tool_id] || 0) + 1;
          return acc;
        }, {}) || {};

        const topTools = Object.entries(toolCounts)
          .map(([tool_id, count]) => ({ tool_id, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          queriesTotal: totalQueries || 0,
          queriesToday: todayQueries || 0,
          toolsUsed: toolsUsedCount,
          successRate,
          dailyUsage,
          topTools
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageStats();
  }, [user]);

  return { stats, loading };
};
