import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, corretora, token } = body;

    // Validação dos campos obrigatórios
    if (!email || !corretora || !token) {
      return NextResponse.json(
        { message: 'Email, corretora e token são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      );
    }

    // Aqui você implementaria a lógica real de conexão com a API da Binolla
    // Por enquanto, vamos simular uma validação básica
    
    // Simulação: token deve ter pelo menos 20 caracteres
    if (token.length < 20) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      );
    }

    // Simulação de sucesso
    // Em produção, aqui você faria:
    // 1. Validar o token com a API da Binolla
    // 2. Salvar as credenciais no banco de dados (criptografadas)
    // 3. Criar uma sessão para o usuário
    
    console.log('Conexão recebida:', {
      email,
      corretora,
      tokenLength: token.length,
    });

    return NextResponse.json(
      {
        message: 'Conexão realizada com sucesso',
        data: {
          email,
          corretora,
          connected: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar conexão:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
