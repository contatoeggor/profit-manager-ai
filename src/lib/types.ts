export interface Trade {
  id: string;
  user_id: string;
  broker_id: string;
  date: string;
  time: string;
  type: 'CALL' | 'PUT';
  amount: number;
  profit: number;
  status: 'WIN' | 'LOSS';
  asset: string;
  created_at: string;
}

export interface Deposit {
  id: string;
  user_id: string;
  broker_id: string;
  amount: number;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  time: string;
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  broker_id: string;
  amount: number;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  date: string;
  time: string;
  created_at: string;
}

export interface DashboardMetrics {
  totalProfit: number;
  todayProfit: number;
  weekProfit: number;
  monthProfit: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netBalance: number;
  winRate: number;
  totalTrades: number;
  depositsWithoutProfit: number; // Nova métrica
}

export interface Broker {
  id: string;
  name: string;
  email: string;
  connected_at: string;
  status: 'active' | 'inactive';
}

export interface DateRange {
  from: Date;
  to: Date;
}
