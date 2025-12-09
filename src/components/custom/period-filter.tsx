'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from '@/lib/types';

interface PeriodFilterProps {
  value: string;
  onChange: (value: string, range?: DateRange) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger className="w-full sm:w-[180px] bg-[#171717] border-gray-700 text-white">
        <Calendar className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Selecione o período" />
      </SelectTrigger>
      <SelectContent className="bg-[#171717] border-gray-700">
        <SelectItem value="all" className="text-white">Todos</SelectItem>
        <SelectItem value="today" className="text-white">Hoje</SelectItem>
        <SelectItem value="week" className="text-white">Esta Semana</SelectItem>
        <SelectItem value="month" className="text-white">Este Mês</SelectItem>
        <SelectItem value="custom" className="text-white">Personalizado</SelectItem>
      </SelectContent>
    </Select>
  );
}
