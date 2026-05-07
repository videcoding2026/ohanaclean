╔══════════════════════════════════════════════════════════════╗
║              MÓDULO 20 - LOGS E AUDITORIA                 ║
║                      ✅ FECHADO                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FUNÇÃO: Registrar automaticamente todas as ações dos       ║
║          usuários no sistema, garantindo rastreabilidade    ║
║          completa e trilha de auditoria.                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ ABRANGÊNCIA DO REGISTRO                                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  O sistema DEVE registrar logs em TODOS os módulos          ║
║  para as seguintes ações:                                   ║
║                                                              ║
║  ├── ✔️ Criação de qualquer registro                       ║
║  ├── ✏️ Edição de qualquer registro                        ║
║  ├── 🗑️ Exclusão de qualquer registro                      ║
║  ├── 🔐 Login e Logout de usuários                         ║
║  ├── 🔑 Alteração de senha ou permissões                   ║
║  ├── 📦 Ajuste manual de estoque                           ║
║  ├── 💰 Registro de pagamentos (receber/pagar)             ║
║  ├── 🏭 Conclusão ou cancelamento de OP                   ║
║  └── ⚙️ Alterações em configurações do sistema            ║
║      (Módulo 02 e Módulo 03)                               ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ DADOS REGISTRADOS EM CADA LOG                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── 👤 Usuário (nome e ID)                                ║
║  ├── 📅 Data e hora (timestamp)                            ║
║  ├── 🌐 Endereço IP do usuário                             ║
║  ├── 📱 Dispositivo / Navegador (opcional)                 ║
║  ├── 📂 Módulo afetado (ex: "Insumos", "Vendas")           ║
║  ├── 🎯 Tipo de ação (CRIAR / EDITAR / EXCLUIR / OUTRO)    ║
║  ├── 🏷️ Entidade (ex: "Pedido", "Cliente")                ║
║  ├── 🔢 ID do registro afetado (ex: PED-26-0001)           ║
║  ├── 📝 Descrição resumida (ex: "Pedido criado")           ║
║  └── 🔍 DETALHES (JSON):                                   ║
║      ├── Antes (valor anterior)                            ║
║      └── Depois (novo valor)                               ║
║      └── Ex: {"preco": {"de": 5.00, "para": 6.00}}       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ CONSULTA DE LOGS (somente Admin)                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── FILTROS AVANÇADOS:                                     ║
║  │   ├── Período (data inicial e final)                   ║
║  │   ├── Usuário específico                                ║
║  │   ├── Módulo (todos ou um específico)                   ║
║  │   ├── Tipo de ação (CRIAR, EDITAR, EXCLUIR...)         ║
║  │   ├── Entidade (ex: "Produto", "Fórmula")              ║
║  │   └── Termo de busca (procura no ID ou descrição)      ║
║  │                                                          ║
║  ├── LISTA DE LOGS (tabela ordenada por data):              ║
║  │   ├── Data/Hora | Usuário | Módulo | Ação | Descrição  ║
║  │   └── Clique expande para ver detalhes (antes/depois)  ║
║  │                                                          ║
║  ├── EXPORTAÇÃO:                                            ║
║  │   ├── Excel (.xlsx) com dados completos                ║
║  │   ├── PDF (relatório simplificado)                      ║
║  │   └── CSV (para importação em sistemas de auditoria)    ║
║  │                                                          ║
║  └── POLÍTICA DE RETENÇÃO (configurável no Módulo 02):     ║
║      ├── Período de retenção (ex: 12 meses)               ║
║      ├── Arquiva logs antigos (não exclui)                ║
║      └── Alerta ao Admin 30 dias antes de arquivar        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRAÇÕES COM OUTROS MÓDULOS                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ├── Módulo 01 (Autenticação): Login, logout, tentativas   ║
║  │   de acesso, bloqueios e desbloqueios.                  ║
║  ├── Módulo 02 (Configurações): Alterações nos parâmetros  ║
║  │   do sistema, dados da empresa, alertas e documentos.   ║
║  ├── Módulo 03 (Permissões): Criação/edição/exclusão de   ║
║  │   usuários, mudanças de perfil e permissões.           ║
║  ├── Módulo 04 (Fornecedores): Criação, edição, exclusão,  ║
║  │   bloqueio e alterações em dados comerciais/bancários.  ║
║  ├── Módulo 05 (Produtos): Criação, edição, exclusão,      ║
║  │   alterações em embalagens, preços e fichas técnicas.   ║
║  ├── Módulo 06 (Fórmulas): Criação, edição, versionamento,  ║
║  │   restauração de versões, alterações na composição.     ║
║  ├── Módulo 07 (Insumos): Criação, edição, exclusão de     ║
║  │   insumos e variantes; alterações em FISPQ e EPIs.      ║
║  ├── Módulo 08 (Compras): Criação, recebimento, devolução   ║
║  │   e cancelamento de compras.                            ║
║  ├── Módulo 09 (Produção): Criação, execução, conclusão    ║
║  │   e cancelamento de OP; alterações no checklist.        ║
║  ├── Módulo 10 (Estoque Insumos): Ajustes manuais,         ║
║  │   transferências e inventários.                         ║
║  ├── Módulo 11 (Estoque Produtos): Ajustes manuais,        ║
║  │   amostras, descartes, inventários.                     ║
║  ├── Módulo 12 (Clientes): Criação, edição, exclusão,      ║
║  │   bloqueio e alterações em dados comerciais.            ║
║  ├── Módulo 13 (Tabela de Preços): Criação, edição,        ║
║  │   reajustes, promoções e alterações de preços.          ║
║  ├── Módulo 14 (Vendas): Criação, alteração de status,     ║
║  │   cancelamento e devolução de pedidos.                  ║
║  ├── Módulo 15 (Contas a Receber): Registro de pagamentos,  ║
║  │   estornos e alterações manuais.                        ║
║  ├── Módulo 16 (Contas a Pagar): Registro de pagamentos,   ║
║  │   estornos e alterações manuais.                        ║
║  ├── Módulo 17 (Dashboard): Acesso e alterações de layout   ║
║  │   personalizado (se aplicável).                         ║
║  ├── Módulo 18 (Relatórios): Execução de relatórios        ║
║  │   (opcional, para auditoria de acesso a dados).         ║
║  └── Módulo 19 (Notificações): Envio de notificações       ║
║      (para trilha de comunicação).                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ TELAS                                                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  └── 🖥️ Consulta de Logs (acesso exclusivo Admin)           ║
║      ├── Painel de filtros (colapsável)                    ║
║      ├── Tabela de logs (com paginação)                   ║
║      ├── Modal de detalhes do log (antes/depois)          ║
║      └── Botões de exportação (Excel/PDF/CSV)             ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║ COMPLEXIDADE: ⭐⭐⭐ Média                                    ║
║ (aumentada pela captura automática em todos os módulos,    ║
║  armazenamento eficiente de dados JSON e consultas         ║
║  com filtros avançados. Essencial para LGPD/auditoria.)    ║
╚══════════════════════════════════════════════════════════════╝