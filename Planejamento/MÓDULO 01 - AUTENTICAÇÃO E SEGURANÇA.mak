╔══════════════════════════════════════════════════════════════╗
║         MÓDULO 01 - AUTENTICAÇÃO E SEGURANÇA               ║
║                    ✅ FECHADO                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Controlar o acesso ao sistema com segurança       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ FUNCIONALIDADES                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  🔑 ACESSO                                                  ║
║  ├── Login com email e senha                               ║
║  │   ├── Mostrar/ocultar senha (ícone de olho)             ║
║  │   ├── Checkbox "Lembrar de mim"                         ║
║  │   └── ⚠️ Alerta: "Use o email cadastrado               ║
║  │              pelo administrador"                         ║
║  ├── Login com Google (OAuth2)                             ║
║  ├── Login com Microsoft (OAuth2)                          ║
║  │   └── Ambos exigem email já cadastrado no sistema       ║
║  └── Exibir último acesso ao entrar                        ║
║                                                              ║
║  🔒 SEGURANÇA                                               ║
║  ├── Bloqueio progressivo por tentativas erradas:          ║
║  │   ├── 1ª a 2ª errada: aviso + tentativas restantes     ║
║  │   ├── 3ª errada: aguardar 5 minutos                    ║
║  │   ├── 6ª errada: aguardar 30 minutos                   ║
║  │   └── 9ª errada: conta bloqueada                       ║
║  ├── 2FA por email (ativado pelo Admin por usuário)        ║
║  └── Sessão com tempo configurável por perfil              ║
║      (definido no Módulo 03)                               ║
║                                                              ║
║  🔓 DESBLOQUEIO DE CONTA                                    ║
║  ├── Opção 1: Recuperação por email (autônoma)             ║
║  └── Opção 2: Notificação ao Admin                         ║
║      └── Aviso de prazo de até 48 horas                    ║
║                                                              ║
║  📧 RECUPERAÇÃO DE SENHA                                    ║
║  ├── Solicitação por email                                 ║
║  ├── Link expira em 30 minutos                             ║
║  ├── Validações da nova senha:                             ║
║  │   ├── Mínimo 8 caracteres                              ║
║  │   ├── 1 letra maiúscula                                ║
║  │   ├── 1 número                                         ║
║  │   └── 1 caractere especial (!@#$)                      ║
║  ├── Confirmação (digitar 2x)                              ║
║  └── Email de aviso após alteração                         ║
║      "Sua senha foi alterada. Não foi você? Contate        ║
║       o administrador imediatamente."                       ║
║                                                              ║
║  📨 SERVIÇO DE EMAIL                                        ║
║  └── Resend.com integrado ao Convex                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 02 (Config. Empresa): Dados da empresa usados  ║
║  │   para personalizar emails de recuperação e login.      ║
║  ├── Módulo 03 (Usuários): O perfil do usuário e as        ║
║  │   configurações de sessão (tempo, 2FA) são aplicadas    ║
║  │   aqui. Bloqueios e desbloqueios notificam o Admin.     ║
║  ├── Módulo 19 (Notificações): Dispara alertas de          ║
║  │   segurança (bloqueio, tentativas suspeitas).           ║
║  └── Módulo 20 (Logs): Registra todas as autenticações     ║
║      (login, logout, bloqueios, alterações de senha).      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                       ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Tela de Login                                       ║
║  ├── 🖥️ Tela de Esqueci minha senha                         ║
║  ├── 🖥️ Tela de Redefinir senha                             ║
║  ├── 🖥️ Tela de Verificação 2FA (quando ativado)            ║
║  └── 🖥️ Tela de Conta Bloqueada                             ║
║      (com opções de desbloqueio)                           ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                   ║
╚══════════════════════════════════════════════════════════════╝