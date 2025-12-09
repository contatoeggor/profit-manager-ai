'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ProfitChartProps {
  data: any[];
}

export function ProfitChart({ data }: ProfitChartProps) {
  const maxProfit = Math.max(...data.map(d => d.profit), 0);
  const minProfit = Math.min(...data.map(d => d.profit), 0);
  const range = maxProfit - minProfit || 1;

  return (
    <Card className="bg-[#171717] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Evolução do Lucro
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-around gap-2">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Nenhum dado disponível para o período selecionado
            </div>
          ) : (
            data.map((item, index) => {
              const height = Math.abs(item.profit) / range * 100;
              const isPositive = item.profit >= 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-48">
                    <div 
                      className={`w-full rounded-t ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      title={`${item.date}: R$ ${item.profit.toFixed(2)}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400 rotate-45 origin-left whitespace-nowrap">
                    {item.date}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
