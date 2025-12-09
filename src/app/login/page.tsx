'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleConnect = async () => {
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      alert('Digite seu email');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/binolla-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailTrimmed, corretora: 'Binolla' })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Conexão salva com sucesso!');
        setMessage({ type: 'success', text: 'Conexão salva com sucesso!' });
      } else {
        alert('Erro: ' + data.error);
        setMessage({ type: 'error', text: `Erro: ${data.error}` });
      }
    } catch (err) {
      alert('Erro inesperado, veja console.');
      console.error(err);
      setMessage({ type: 'error', text: 'Erro inesperado, veja console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#171717] border-gray-700">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profit-Manager.AI
          </h1>
          <p className="text-gray-400 text-sm">
            Conecte sua conta Binolla
          </p>
        </div>

        <div className="space-y-6">
          {/* Campo de Email */}
          <div className="space-y-2">
            <Label htmlFor="inputEmail" className="text-white">
              Email
            </Label>
            <Input
              id="inputEmail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-gray-600 text-white placeholder:text-gray-500"
              disabled={loading}
            />
          </div>

          {/* Mensagens de Sucesso/Erro */}
          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : 'bg-red-900/30 text-red-400 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Botão Conectar */}
          <Button
            id="btnConectar"
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Conectando...' : 'Conectar Binolla'}
          </Button>

          <p className="text-gray-500 text-xs text-center mt-4">
            O token será gerado automaticamente pelo backend após a conexão.
          </p>
        </div>
      </Card>
    </div>
  );
}
