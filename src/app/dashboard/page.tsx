'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, ArrowDownCircle, ArrowUpCircle, Target, BarChart3, History, XCircle } from 'lucide-react';
import { MetricCard } from '@/components/custom/metric-card';
import { ProfitChart } from '@/components/custom/profit-chart';
import { PeriodFilter } from '@/components/custom/period-filter';
import { BrokerLoginDialog } from '@/components/custom/broker-login-dialog';
import { BrokerSelector } from '@/components/custom/broker-selector';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Button } from '@/components/ui/button';
import { Trade, Deposit, Withdrawal, DashboardMetrics, Broker, DateRange } from '@/lib/types';
import { calculateMetrics, filterDataByPeriod, prepareChartData } from '@/lib/utils-data';

// Mock data for demonstration
const mockTrades: Trade[] = [
  { id: '1', user_id: '1', broker_id: '1', date: '2024-01-15', time: '10:30', type: 'CALL', amount: 100, profit: 85, status: 'WIN', asset: 'EUR/USD', created_at: '2024-01-15T10:30:00Z' },
  { id: '2', user_id: '1', broker_id: '1', date: '2024-01-15', time: '14:20', type: 'PUT', amount: 150, profit: -150, status: 'LOSS', asset: 'BTC/USD', created_at: '2024-01-15T14:20:00Z' },
  { id: '3', user_id: '1', broker_id: '2', date: '2024-01-16', time: '09:15', type: 'CALL', amount: 200, profit: 170, status: 'WIN', asset: 'GBP/USD', created_at: '2024-01-16T09:15:00Z' },
  { id: '4', user_id: '1', broker_id: '2', date: '2024-01-16', time: '16:45', type: 'PUT', amount: 100, profit: 85, status: 'WIN', asset: 'EUR/USD', created_at: '2024-01-16T16:45:00Z' },
  { id: '5', user_id: '1', broker_id: '1', date: '2024-01-17', time: '11:00', type: 'CALL', amount: 250, profit: 212.5, status: 'WIN', asset: 'USD/JPY', created_at: '2024-01-17T11:00:00Z' },
];

const mockDeposits: Deposit[] = [
  { id: '1', user_id: '1', broker_id: '1', amount: 1000, method: 'PIX', status: 'COMPLETED', date: '2024-01-10', time: '08:00', created_at: '2024-01-10T08:00:00Z' },
  { id: '2', user_id: '1', broker_id: '2', amount: 500, method: 'Cartão de Crédito', status: 'COMPLETED', date: '2024-01-12', time: '14:30', created_at: '2024-01-12T14:30:00Z' },
];

const mockWithdrawals: Withdrawal[] = [
  { id: '1', user_id: '1', broker_id: '1', amount: 300, method: 'PIX', status: 'COMPLETED', date: '2024-01-14', time: '10:00', created_at: '2024-01-14T10:00:00Z' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState('all');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [selectedBrokerId, setSelectedBrokerId] = useState('all');
  const [brokers, setBrokers] = useState<Broker[]>([
    { id: '1', name: 'IQ Option', email: 'user@iqoption.com', connected_at: '2024-01-01T00:00:00Z', status: 'active' },
    { id: '2', name: 'Quotex', email: 'user@quotex.com', connected_at: '2024-01-02T00:00:00Z', status: 'active' },
  ]);
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [deposits, setDeposits] = useState<Deposit[]>(mockDeposits);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Filter data by broker
    let filteredTrades = trades;
    let filteredDeposits = deposits;
    let filteredWithdrawals = withdrawals;

    if (selectedBrokerId !== 'all') {
      filteredTrades = trades.filter(t => t.broker_id === selectedBrokerId);
      filteredDeposits = deposits.filter(d => d.broker_id === selectedBrokerId);
      filteredWithdrawals = withdrawals.filter(w => w.broker_id === selectedBrokerId);
    }

    // Filter data based on selected period
    filteredTrades = filterDataByPeriod(filteredTrades, period, customRange);
    filteredDeposits = filterDataByPeriod(filteredDeposits, period, customRange);
    filteredWithdrawals = filterDataByPeriod(filteredWithdrawals, period, customRange);

    // Calculate metrics
    const calculatedMetrics = calculateMetrics(filteredTrades, filteredDeposits, filteredWithdrawals);
    setMetrics(calculatedMetrics);

    // Prepare chart data
    const preparedChartData = prepareChartData(filteredTrades);
    setChartData(preparedChartData);
  }, [mounted, period, customRange, selectedBrokerId, trades, deposits, withdrawals]);

  const handlePeriodChange = (value: string, range?: DateRange) => {
    setPeriod(value);
    setCustomRange(range);
  };

  const handleBrokerAdded = (broker: Broker) => {
    setBrokers([...brokers, broker]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#171717] border-b border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/6781d988-b4d6-4d4b-932e-e5c83708e5f5.png" 
                alt="Profit-Manager.AI Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Profit-Manager.AI
                </h1>
                <p className="text-sm text-gray-400">
                  Gerenciador de Lucros em Opções Binárias
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <BrokerLoginDialog onBrokerAdded={handleBrokerAdded} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Filter and Broker Selector */}
        <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            Dashboard de Desempenho
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <PeriodFilter value={period} onChange={handlePeriodChange} />
            <BrokerSelector 
              brokers={brokers} 
              selectedBrokerId={selectedBrokerId} 
              onChange={setSelectedBrokerId} 
            />
          </div>
        </div>

        {/* Metrics Grid - Primeira linha (2 cards) */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <MetricCard
              title="Lucro Total"
              value={formatCurrency(metrics.totalProfit)}
              icon={DollarSign}
              trend={metrics.totalProfit > 0 ? 'up' : metrics.totalProfit < 0 ? 'down' : 'neutral'}
              valueColor={metrics.totalProfit > 0 ? 'text-green-600 dark:text-green-400' : metrics.totalProfit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
            />
            <MetricCard
              title="Lucro Hoje"
              value={formatCurrency(metrics.todayProfit)}
              icon={TrendingUp}
              trend={metrics.todayProfit > 0 ? 'up' : metrics.todayProfit < 0 ? 'down' : 'neutral'}
              valueColor={metrics.todayProfit > 0 ? 'text-green-600 dark:text-green-400' : metrics.todayProfit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
            />
          </div>
        )}

        {/* Additional Metrics - Segunda linha (4 cards) */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Lucro da Semana"
              value={formatCurrency(metrics.weekProfit)}
              icon={TrendingUp}
              trend={metrics.weekProfit > 0 ? 'up' : metrics.weekProfit < 0 ? 'down' : 'neutral'}
              valueColor={metrics.weekProfit > 0 ? 'text-green-600 dark:text-green-400' : metrics.weekProfit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
            />
            <MetricCard
              title="Lucro do Mês"
              value={formatCurrency(metrics.monthProfit)}
              icon={TrendingUp}
              trend={metrics.monthProfit > 0 ? 'up' : metrics.monthProfit < 0 ? 'down' : 'neutral'}
              valueColor={metrics.monthProfit > 0 ? 'text-green-600 dark:text-green-400' : metrics.monthProfit < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}
            />
            <MetricCard
              title="Total de Depósitos"
              value={formatCurrency(metrics.totalDeposits)}
              icon={ArrowDownCircle}
              trend="neutral"
              valueColor="text-green-600 dark:text-green-400"
            />
            <MetricCard
              title="Depósitos sem Lucro"
              value={metrics.depositsWithoutProfit.toString()}
              icon={XCircle}
              trend="neutral"
              subtitle="Depósitos sem saques"
              valueColor="text-orange-600 dark:text-orange-400"
            />
          </div>
        )}

        {/* Chart */}
        <div className="mb-8">
          <ProfitChart data={chartData} />
        </div>

        {/* Taxa de Acerto - Movido para baixo do gráfico */}
        {metrics && (
          <div className="mb-8">
            <MetricCard
              title="Taxa de Acerto"
              value={formatPercentage(metrics.winRate)}
              icon={Target}
              trend="neutral"
              subtitle={`${metrics.totalTrades} trades realizados`}
              valueColor="text-blue-600 dark:text-blue-400"
            />
          </div>
        )}

        {/* Action Button - Histórico Completo */}
        <div className="mb-8">
          <Button 
            onClick={() => router.push('/historico')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold"
          >
            <History className="w-5 h-5 mr-2" />
            Ver Histórico Completo
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#171717] border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-400">
            © 2025 Profit-Manager.AI - Gerenciador de Lucros em Opções Binárias
          </p>
        </div>
      </footer>
    </div>
  );
}
