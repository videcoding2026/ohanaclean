╔══════════════════════════════════════════════════════════════╗
║      MÓDULO 03 - GESTÃO DE USUÁRIOS E PERMISSÕES            ║
║                    ✅ FECHADO                                ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Controlar quem acessa e o que pode fazer           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ PERFIS DE ACESSO                                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  👑 ADMINISTRADOR                                            ║
║  ├── Acesso total ao sistema                                ║
║  ├── Único que gerencia usuários                            ║
║  ├── Configura o sistema (Módulo 02)                        ║
║  ├── Vê todos os valores                                    ║
║  ├── Acessa logs de auditoria                               ║
║  └── Sessão: 4 horas (configurável)                         ║
║                                                              ║
║  🏭 PRODUÇÃO                                                 ║
║  ├── Visualiza fórmulas (sem valores)                       ║
║  ├── Cria e executa ordens de produção                      ║
║  ├── Visualiza estoque de insumos (sem valores)             ║
║  ├── Registra consumo de insumos                            ║
║  ├── Valores financeiros: ❌ R$ xx,xx                       ║
║  └── Sessão: 8 horas (configurável)                         ║
║                                                              ║
║  📦 ESTOQUE                                                  ║
║  ├── Controla estoque de insumos (sem valores)              ║
║  ├── Controla estoque de produtos (sem valores)             ║
║  ├── Registra compras de insumos                            ║
║  ├── Faz ajustes de estoque                                 ║
║  ├── Valores financeiros: ❌ R$ xx,xx                       ║
║  └── Sessão: 8 horas (configurável)                         ║
║                                                              ║
║  🛒 VENDAS                                                   ║
║  ├── Cadastra e edita clientes                              ║
║  ├── Cria e gerencia pedidos                                ║
║  ├── Vê preço de venda e desconto máximo                    ║
║  ├── Consulta estoque disponível (sem valores)              ║
║  ├── Emite recibos                                          ║
║  ├── Custo/Margem dos produtos: ❌ R$ xx,xx                 ║
║  └── Sessão: 6 horas (configurável)                         ║
║                                                              ║
║  💰 FINANCEIRO                                               ║
║  ├── Contas a receber e pagar                               ║
║  ├── Fluxo de caixa                                         ║
║  ├── Relatórios financeiros                                 ║
║  ├── Custo de fórmulas/insumos: ❌ R$ xx,xx (exceto nos    ║
║  │   relatórios agregados do Módulo 15)                     ║
║  └── Sessão: 4 horas (configurável)                         ║
║                                                              ║
║  👁️ VISUALIZADOR (Somente Leitura)                          ║
║  ├── Acesso de leitura ao dashboard                         ║
║  ├── Acesso de leitura a todos relatórios                   ║
║  ├── Vê todos os valores                                    ║
║  ├── Não cria, edita ou exclui nada                         ║
║  └── Sessão: 4 horas (configurável)                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ MATRIZ DE PERMISSÕES                                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║          │Admin│Prod.│Est.│Vend.│Fin.│Visual│               ║
║  ────────┼─────┼─────┼────┼─────┼────┼──────┤               ║
║  Config. │ ✅  │ ❌  │ ❌ │ ❌  │ ❌ │  ❌  │               ║
║  Usuários│ ✅  │ ❌  │ ❌ │ ❌  │ ❌ │  ❌  │               ║
║  Fórmulas│ ✅  │ 👁️  │ ❌ │ ❌  │ ❌ │  👁️  │               ║
║  Insumos │ ✅  │ 👁️  │ ✅ │ ❌  │ ❌ │  👁️  │               ║
║  Produção│ ✅  │ ✅  │ 👁️ │ ❌  │ ❌ │  👁️  │               ║
║  Estoque │ ✅  │ 👁️  │ ✅ │ 👁️  │ ❌ │  👁️  │               ║
║  Clientes│ ✅  │ ❌  │ ❌ │ ✅  │ 👁️ │  👁️  │               ║
║  Pedidos │ ✅  │ ❌  │ ❌ │ ✅  │ 👁️ │  👁️  │               ║
║  Financ. │ ✅  │ ❌  │ ❌ │ ❌  │ ✅ │  👁️  │               ║
║  Relat.  │ ✅  │ 👁️  │ 👁️ │ 👁️  │ ✅ │  👁️  │               ║
║  Dashboard│ ✅ │ 👁️  │ 👁️ │ 👁️  │ 👁️ │  👁️  │               ║
║                                                              ║
║  ✅ Acesso total  👁️ Somente ver  ❌ Sem acesso             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CAMUFLAGEM DE VALORES SENSÍVEIS                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Perfis para quem os valores de custo aparecem MASCARADOS   ║
║  ├── 🏭 Produção:    custo insumos e produção               ║
║  ├── 📦 Estoque:     custo unitário e total                 ║
║  ├── 🛒 Vendas:      custo e margem dos produtos            ║
║  └── 💰 Financeiro:  custo de fórmulas e insumos            ║
║      (exceto relatórios agregados do Módulo 15)             ║
║                                                              ║
║  Perfis que veem os VALORES REAIS (sem mascaramento):       ║
║  ├── 👑 Administrador: todos os valores visíveis            ║
║  └── 👁️ Visualizador:  todos os valores visíveis            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CADASTRO DE USUÁRIOS                                         ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Nome completo              (obrigatório)               ║
║  ├── Email                      (obrigatório)               ║
║  ├── Telefone / WhatsApp        (opcional)                  ║
║  ├── Foto de perfil             (opcional)                  ║
║  ├── Cargo / Função             (opcional)                  ║
║  ├── Data de admissão           (opcional)                  ║
║  ├── Perfil de acesso           (obrigatório)               ║
║  └── Status: Ativo / Inativo                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ GESTÃO DE SENHAS PELO ADMIN                                  ║
╠══════════════════════════════════════════════════════════════╣
║  ├── ✅ Editar senha diretamente                            ║
║  │   └── Usuário obrigado a trocar no próximo acesso       ║
║  ├── ✅ Forçar reset por email                              ║
║  └── ✅ Notificação ao usuário em ambos os casos            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ACESSO E SESSÃO                                              ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 1 dispositivo ativo por vez por usuário                ║
║  ├── Novo login encerra sessão anterior (com aviso)         ║
║  ├── Admin força logout de qualquer usuário                 ║
║  └── Tempo de sessão configurável por perfil                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DADOS DE USUÁRIO INATIVADO                                   ║
╠══════════════════════════════════════════════════════════════╣
║  ├── Acesso encerrado imediatamente                         ║
║  ├── Dados mantidos e visíveis por 1 ano                   ║
║  ├── Alerta ao Admin 30 dias antes de arquivar             ║
║  └── Após 1 ano: arquivado (não excluído)                  ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 01 (Autenticação): Aplica permissões e tempos  ║
║  │   de sessão configurados aqui.                           ║
║  ├── Módulo 02 (Config. Empresa): Herda configurações      ║
║  │   gerais para novos usuários.                           ║
║  ├── Módulo 04 a 19: A matriz de permissões controla o     ║
║  │   acesso a cada módulo e a camuflagem de valores.       ║
║  ├── Módulo 19 (Notificações): Notifica sobre ações de     ║
║  │   usuários (bloqueios, inativações).                    ║
║  └── Módulo 20 (Logs): Registra todas as alterações em     ║
║      usuários e permissões.                                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║  ├── 🖥️ Lista de Usuários                                    ║
║  ├── 🖥️ Cadastro / Edição de Usuário                         ║
║  ├── 🖥️ Detalhe do Usuário (histórico de acessos)            ║
║  └── 🖥️ Meu Perfil (edição própria)                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
╚══════════════════════════════════════════════════════════════╝