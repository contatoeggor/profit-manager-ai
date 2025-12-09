'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Broker } from '@/lib/types';

interface BrokerLoginDialogProps {
  onBrokerAdded: (broker: Broker) => void;
}

export function BrokerLoginDialog({ onBrokerAdded }: BrokerLoginDialogProps) {
  const [open, setOpen] = useState(false);
  const [brokerName, setBrokerName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      const newBroker: Broker = {
        id: Date.now().toString(),
        name: brokerName,
        email: email,
        connected_at: new Date().toISOString(),
        status: 'active'
      };

      onBrokerAdded(newBroker);
      setOpen(false);
      setBrokerName('');
      setEmail('');
    } catch (error) {
      console.error('Error adding broker:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Conectar Corretora
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#171717] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Conectar Nova Corretora</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adicione suas credenciais para conectar uma corretora
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="broker">Corretora</Label>
            <Select value={brokerName} onValueChange={setBrokerName} required>
              <SelectTrigger className="bg-[#0a0a0a] border-gray-700">
                <SelectValue placeholder="Selecione a corretora" />
              </SelectTrigger>
              <SelectContent className="bg-[#171717] border-gray-700">
                <SelectItem value="IQ Option">IQ Option</SelectItem>
                <SelectItem value="Quotex">Quotex</SelectItem>
                <SelectItem value="Binolla">Binolla</SelectItem>
                <SelectItem value="Pocket Option">Pocket Option</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="bg-[#0a0a0a] border-gray-700 text-white"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            disabled={loading}
          >
            {loading ? 'Conectando...' : 'Conectar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
