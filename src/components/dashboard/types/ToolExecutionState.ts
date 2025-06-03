
export interface ToolExecutionState {
  isLoading: boolean;
  progress: number;
  result: any;
  error: string | null;
  executionTime: number | null;
  usage?: {
    dailyUsed: number;
    dailyLimit: number;
    remaining: number;
  };
}
