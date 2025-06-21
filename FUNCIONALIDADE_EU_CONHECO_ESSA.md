# Funcionalidade "Eu Conheço Essa!" - Sugflora

## Visão Geral

A funcionalidade "Eu Conheço Essa!" permite que usuários visualizem coletas públicas que precisam de ajuda para identificação e sugiram identificações baseadas em suas observações e conhecimento.

## Estrutura Implementada

### 1. Modelo de Dados

#### SugestaoIdentificacao
- **Arquivo**: `data/sugestoes/SugestaoIdentificacao.tsx`
- **Propósito**: Modelo para armazenar sugestões de identificação
- **Campos principais**:
  - `coleta_id`: ID da coleta que recebeu a sugestão
  - `usuario_sugerente_id`: ID do usuário que fez a sugestão
  - `especie_sugerida_id`, `genero_sugerido_id`, `familia_sugerida_id`: Classificação taxonômica sugerida
  - `nome_comum_sugerido`: Nome comum sugerido
  - `justificativa`: Explicação da sugestão
  - `confianca`: Nível de confiança (1-5)
  - `status`: Status da sugestão (pendente, aceita, rejeitada, em_analise)
  - `observacoes_adicionais`: Informações complementares

### 2. Serviços de Dados

#### SugestaoIdentificacaoData
- **Arquivo**: `data/sugestoes/SugestaoIdentificacaoData.tsx`
- **Funcionalidades**:
  - CRUD completo para sugestões
  - Busca por coleta, usuário, status
  - Atualização de status
  - Dados de exemplo para testes

#### SugestaoIdentificacaoContext
- **Arquivo**: `data/sugestoes/SugestaoIdentificacaoContext.tsx`
- **Propósito**: Contexto React para gerenciar sugestões
- **Hooks disponíveis**:
  - `useSugestaoIdentificacaoData()`: Acesso ao contexto

### 3. Métodos Adicionados ao ColetaData

#### Novos métodos em ColetaData:
- `getSolicitamAjuda()`: Busca coletas que solicitam ajuda
- `getColetasPublicas()`: Busca coletas públicas
- `getColetasParaIdentificacao()`: Busca coletas com informações limitadas (sem dados sigilosos)

#### Novos métodos em ColetaDataContext:
- `getColetasSolicitamAjuda()`
- `getColetasPublicas()`
- `getColetasParaIdentificacao()`

### 4. Telas Implementadas

#### EuConhecoEssa (Tela Principal)
- **Arquivo**: `screens/EuConhecoEssa.js`
- **Funcionalidades**:
  - Lista coletas que solicitam ajuda
  - Filtros por status e características
  - Estatísticas das coletas disponíveis
  - Visualização de imagens e informações básicas
  - Navegação para detalhes e sugestões

#### TelaPedidodeAjuda (Detalhes da Coleta)
- **Arquivo**: `screens/TelaPedidodeAjuda-AjudemeaIdentificar.js`
- **Funcionalidades**:
  - Visualização detalhada da coleta
  - Galeria de imagens com navegação
  - Classificação taxonômica atual
  - Observações do coletor
  - Lista de sugestões existentes
  - Informações de segurança

#### ChatAjudemeaIdentificar (Formulário de Sugestão)
- **Arquivo**: `screens/Chat-AjudemeaIdentificar.js`
- **Funcionalidades**:
  - Formulário completo para sugestão
  - Seleção hierárquica de classificação taxonômica
  - Campo de justificativa obrigatório
  - Nível de confiança (1-5 estrelas)
  - Observações adicionais
  - Validações e feedback

## Fluxo de Uso

### 1. Acesso à Funcionalidade
- Usuário navega para "Eu Conheço Essa!"
- Sistema carrega coletas que solicitam ajuda
- Informações sigilosas (projeto/campo) são ocultadas

### 2. Visualização de Coletas
- Lista com filtros disponíveis
- Estatísticas em tempo real
- Cards com informações essenciais
- Botões para ver detalhes ou sugerir identificação

### 3. Detalhes da Coleta
- Visualização completa da coleta
- Galeria de imagens interativa
- Classificação atual e observações
- Sugestões existentes com status
- Informações sobre privacidade

### 4. Sugestão de Identificação
- Formulário estruturado
- Seleção hierárquica (Família → Gênero → Espécie)
- Justificativa obrigatória
- Nível de confiança
- Observações complementares
- Validações antes do envio

## Características de Segurança

### Proteção de Dados
- **Sigilo de Projeto/Campo**: Informações sobre localização específica são mantidas em sigilo
- **Dados Limitados**: Apenas informações necessárias para identificação são exibidas
- **Controle de Acesso**: Sugestões são revisadas pelo coletor original

### Estrutura para Algoritmo de Matching
A funcionalidade foi estruturada para facilitar futuras implementações de algoritmos de matching:

#### Pontos de Integração:
1. **Perfil do Usuário**: Histórico de sugestões e especialidades
2. **Características da Coleta**: Família, gênero, localização geográfica
3. **Sugestões Anteriores**: Histórico de sugestões aceitas/rejeitadas
4. **Confiança**: Nível de confiança das sugestões anteriores

#### Dados Disponíveis para Matching:
- `usuario_sugerente_id`: Para análise de perfil
- `confianca`: Para ponderar sugestões
- `status`: Para feedback do algoritmo
- `familia_id`, `genero_id`, `especie_id`: Para matching taxonômico
- `justificativa`: Para análise de qualidade

## Integração com o Sistema

### Providers Adicionados
- `SugestaoIdentificacaoDataProvider` integrado ao `AppDataProvider`

### Rotas Adicionadas
- `TelaPedidodeAjuda-AjudemeaIdentificar`
- `Chat-AjudemeaIdentificar`

### Dependências
- Utiliza contextos existentes (Família, Gênero, Espécie, Usuário)
- Integra com sistema de notificações
- Compatível com sistema de sincronização

## Dados de Exemplo

### Sugestões de Teste
- 2 sugestões para a "Coleta 3 - Espécie C"
- Diferentes níveis de confiança
- Justificativas detalhadas
- Status pendente

### Coletas de Teste
- Coleta 3 configurada para solicitar ajuda
- Imagens e observações incluídas
- Classificação parcial disponível

## Próximos Passos

### Melhorias Sugeridas:
1. **Algoritmo de Matching**: Implementar sistema de recomendação
2. **Notificações**: Alertas para novas sugestões
3. **Gamificação**: Sistema de pontos por sugestões aceitas
4. **Análise de Qualidade**: Métricas de qualidade das sugestões
5. **Colaboração**: Sistema de comentários e discussões

### Funcionalidades Futuras:
1. **Chat em Tempo Real**: Comunicação direta entre usuários
2. **Sistema de Reputação**: Baseado em histórico de sugestões
3. **Machine Learning**: Análise automática de características
4. **Integração Externa**: APIs de identificação automática

## Considerações Técnicas

### Performance
- Carregamento lazy de imagens
- Filtros otimizados
- Paginação para grandes volumes

### Usabilidade
- Interface intuitiva
- Feedback visual claro
- Validações em tempo real
- Navegação fluida

### Manutenibilidade
- Código modular
- Separação de responsabilidades
- Documentação clara
- Estrutura escalável 