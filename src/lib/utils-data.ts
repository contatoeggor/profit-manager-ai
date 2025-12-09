import { Trade, Deposit, Withdrawal, DashboardMetrics, DateRange } from './types';

export function calculateMetrics(
  trades: Trade[],
  deposits: Deposit[],
  withdrawals: Withdrawal[]
): DashboardMetrics {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Calculate week start (Monday)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  const weekStartStr = weekStart.toISOString().split('T')[0];
  
  // Calculate month start
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split('T')[0];

  // Total profit
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);

  // Today's profit
  const todayProfit = trades
    .filter(trade => trade.date === today)
    .reduce((sum, trade) => sum + trade.profit, 0);

  // Week's profit
  const weekProfit = trades
    .filter(trade => trade.date >= weekStartStr)
    .reduce((sum, trade) => sum + trade.profit, 0);

  // Month's profit
  const monthProfit = trades
    .filter(trade => trade.date >= monthStartStr)
    .reduce((sum, trade) => sum + trade.profit, 0);

  // Total deposits
  const totalDeposits = deposits
    .filter(d => d.status === 'COMPLETED')
    .reduce((sum, deposit) => sum + deposit.amount, 0);

  // Total withdrawals
  const totalWithdrawals = withdrawals
    .filter(w => w.status === 'COMPLETED')
    .reduce((sum, withdrawal) => sum + withdrawal.amount, 0);

  // Net balance
  const netBalance = totalDeposits - totalWithdrawals + totalProfit;

  // Win rate
  const winningTrades = trades.filter(trade => trade.status === 'WIN').length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Depósitos sem lucro (depósitos que não resultaram em saques)
  // Lógica: Para cada depósito, verificar se houve saques após ele
  const depositsWithoutProfit = deposits.filter(deposit => {
    if (deposit.status !== 'COMPLETED') return false;
    
    // Verificar se houve algum saque após este depósito
    const depositDate = new Date(deposit.created_at);
    const withdrawalsAfterDeposit = withdrawals.filter(w => {
      if (w.status !== 'COMPLETED') return false;
      const withdrawalDate = new Date(w.created_at);
      return withdrawalDate > depositDate && w.broker_id === deposit.broker_id;
    });
    
    // Se não houve saques após este depósito, conta como "sem lucro"
    return withdrawalsAfterDeposit.length === 0;
  }).length;

  return {
    totalProfit,
    todayProfit,
    weekProfit,
    monthProfit,
    totalDeposits,
    totalWithdrawals,
    netBalance,
    winRate,
    totalTrades,
    depositsWithoutProfit,
  };
}

export function filterDataByPeriod<T extends { date: string }>(
  data: T[],
  period: string,
  customRange?: DateRange
): T[] {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (period === 'all') {
    return data;
  }

  if (period === 'custom' && customRange) {
    const fromStr = customRange.from.toISOString().split('T')[0];
    const toStr = customRange.to.toISOString().split('T')[0];
    return data.filter(item => item.date >= fromStr && item.date <= toStr);
  }

  if (period === 'today') {
    return data.filter(item => item.date === today);
  }

  if (period === 'week') {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    const weekStartStr = weekStart.toISOString().split('T')[0];
    return data.filter(item => item.date >= weekStartStr);
  }

  if (period === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    return data.filter(item => item.date >= monthStartStr);
  }

  return data;
}

export function prepareChartData(trades: Trade[]) {
  // Group trades by date and calculate cumulative profit
  const groupedByDate = trades.reduce((acc, trade) => {
    if (!acc[trade.date]) {
      acc[trade.date] = 0;
    }
    acc[trade.date] += trade.profit;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by date
  const sortedData = Object.entries(groupedByDate)
    .map(([date, profit]) => ({ date, profit }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate cumulative profit
  let cumulative = 0;
  return sortedData.map(item => {
    cumulative += item.profit;
    return {
      date: item.date,
      profit: cumulative,
    };
  });
}
