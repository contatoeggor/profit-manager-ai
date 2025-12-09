'use client';

import { Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Broker } from '@/lib/types';

interface BrokerSelectorProps {
  brokers: Broker[];
  selectedBrokerId: string;
  onChange: (brokerId: string) => void;
}

export function BrokerSelector({ brokers, selectedBrokerId, onChange }: BrokerSelectorProps) {
  return (
    <Select value={selectedBrokerId} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px] bg-[#171717] border-gray-700 text-white">
        <Building2 className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Todas as corretoras" />
      </SelectTrigger>
      <SelectContent className="bg-[#171717] border-gray-700">
        <SelectItem value="all" className="text-white">Todas as Corretoras</SelectItem>
        {brokers.map((broker) => (
          <SelectItem key={broker.id} value={broker.id} className="text-white">
            {broker.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
