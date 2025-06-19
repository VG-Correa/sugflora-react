# SugFlora - Estrutura de Dados Organizada

Este documento descreve a estrutura de dados organizada do projeto SugFlora, incluindo todas as funcionalidades implementadas para persistência local, sincronização, cache e otimizações de performance.

## 📁 Estrutura de Pastas

```
data/
├── config/
│   └── AppConfig.tsx              # Configurações centralizadas da aplicação
├── services/
│   ├── PersistenceService.tsx     # Serviço de persistência local
│   ├── CacheService.tsx           # Serviço de cache em memória
│   └── SyncService.tsx            # Serviço de sincronização com APIs
├── hooks/
│   └── useNetworkStatus.tsx       # Hook para gerenciar status da rede
├── usuarios/
│   ├── Usuario.tsx                # Classe principal de usuário
│   ├── UsuarioData.tsx            # Operações CRUD de usuários
│   └── UsuarioDataContext.tsx     # Contexto React para usuários
├── projetos/
│   ├── Projeto.tsx                # Classe principal de projeto
│   ├── ProjetoData.tsx            # Operações CRUD de projetos
│   └── ProjetoDataContext.tsx     # Contexto React para projetos
├── campos/
│   ├── Campo.tsx                  # Classe principal de campo
│   ├── CampoData.tsx              # Operações CRUD de campos
│   └── CampoDataContext.tsx       # Contexto React para campos
├── coletas/
│   ├── Coleta.tsx                 # Classe principal de coleta
│   ├── ColetaData.tsx             # Operações CRUD de coletas
│   └── ColetaDataContext.tsx      # Contexto React para coletas
├── familias/
│   ├── Familia.tsx                # Classe principal de família
│   ├── FamiliaData.tsx            # Operações CRUD de famílias
│   └── FamiliaDataContext.tsx     # Contexto React para famílias
├── generos/
│   ├── Genero.tsx                 # Classe principal de gênero
│   ├── GeneroData.tsx             # Operações CRUD de gêneros
│   └── GeneroDataContext.tsx      # Contexto React para gêneros
├── especies/
│   ├── Especie.tsx                # Classe principal de espécie
│   ├── EspecieData.tsx            # Operações CRUD de espécies
│   └── EspecieDataContext.tsx     # Contexto React para espécies
├── notificacoes/
│   ├── Notificacao.tsx            # Classe principal de notificação
│   ├── NotificacaoData.tsx        # Operações CRUD de notificações
│   └── NotificacaoDataContext.tsx # Contexto React para notificações
├── relatorios/
│   ├── Relatorio.tsx              # Classe principal de relatório
│   ├── RelatorioData.tsx          # Operações CRUD de relatórios
│   └── RelatorioDataContext.tsx   # Contexto React para relatórios
├── AppDataProvider.tsx            # Provider principal que combina todos os contextos
└── README.md                      # Este arquivo
```

## 🚀 Funcionalidades Implementadas

### 1. Persistência Local (AsyncStorage)

- **PersistenceService**: Gerencia o armazenamento local de todos os dados
- Armazenamento automático de todas as entidades
- Recuperação de dados offline
- Limpeza automática de dados antigos
- Monitoramento de uso de armazenamento

### 2. Cache em Memória

- **CacheService**: Sistema de cache inteligente com TTL configurável
- Cache específico para cada tipo de entidade
- Cache de buscas e consultas frequentes
- Limpeza automática de itens expirados
- Estatísticas de performance (hit/miss rate)

### 3. Sincronização com APIs

- **SyncService**: Sincronização bidirecional com servidor
- Detecção automática de conectividade
- Retry automático em caso de falha
- Sincronização em lote para otimizar performance
- Envio de dados pendentes quando online

### 4. Gerenciamento de Rede

- **useNetworkStatus**: Hook para monitorar status da rede
- Detecção automática de mudanças de conectividade
- Sincronização automática quando conexão é restaurada
- Indicadores visuais de status offline/online

### 5. Configuração Centralizada

- **AppConfig**: Configurações centralizadas para toda a aplicação
- Configurações específicas por ambiente (dev/prod)
- Validação automática de configurações
- Configurações de cache, sincronização e API

## 🛠️ Como Usar

### 1. Configuração Inicial

```tsx
// App.js ou index.js
import { AppDataProvider } from "./data/AppDataProvider";

export default function App() {
  return <AppDataProvider>{/* Sua aplicação aqui */}</AppDataProvider>;
}
```

### 2. Usando Contextos em Componentes

```tsx
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const MeuComponente = () => {
  const { projetos, loading, createProjeto } = useProjetoData();
  const { campos, getCamposByProjeto } = useCampoData();

  // Usar os dados e métodos
};
```

### 3. Monitorando Status da Rede

```tsx
import { useNetworkStatus } from "../data/hooks/useNetworkStatus";
import NetworkStatusBar from "../components/NetworkStatusBar";

const MinhaTela = () => {
  const { networkStatus, performSync } = useNetworkStatus();

  return (
    <View>
      <NetworkStatusBar onSyncPress={performSync} />
      {/* Resto do conteúdo */}
    </View>
  );
};
```

### 4. Acessando Serviços Diretamente

```tsx
import { useAppServices } from "../data/AppDataProvider";

const MeuComponente = () => {
  const { persistence, cache, sync } = useAppServices();

  const limparDados = async () => {
    await persistence.clearAllData();
    cache.clear();
  };
};
```

## 📊 Telas Atualizadas

As seguintes telas já foram atualizadas para usar a nova estrutura:

### ✅ Telas Completamente Atualizadas

- `MyCollection.js` - Usa contexto de coletas
- `AddCollection.js` - Usa contexto de coletas e espécies
- `SearchSpecies.js` - Usa contexto de espécies com cache
- `NewProject.js` - Usa contexto de projetos
- `NewField.js` - Usa contexto de campos
- `MyProjects.js` - Usa contexto de projetos
- `EditProject.js` - Usa contexto de projetos
- `EditField.js` - Usa contexto de campos

### 🔄 Próximas Telas para Atualizar

- `FieldScreen.js`
- `ProjectScreen.js`
- `MyReports.js`
- `ReportScreenQualitativo.js`
- `ReportScreenQuantitativo.js`
- `Profile.js`
- `EditProfile.js`
- `EditUser.js`

## 🔧 Configurações

### Configurações de Cache

```tsx
// Em AppConfig.tsx
CACHE: {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutos
  MAX_SIZE: 200,
  TTL: {
    USUARIOS: 10 * 60 * 1000, // 10 minutos
    ESPECIES: 30 * 60 * 1000, // 30 minutos (dados mais estáticos)
  }
}
```

### Configurações de Sincronização

```tsx
SYNC: {
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
  MANUAL_SYNC_TIMEOUT: 30 * 1000, // 30 segundos
  BATCH_SIZE: 50, // Número de itens por lote
}
```

### Configurações de API

```tsx
API: {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
}
```

## 📈 Benefícios da Nova Estrutura

### 1. **Organização**

- Estrutura clara e lógica por entidade
- Separação de responsabilidades
- Fácil manutenção e extensão

### 2. **Performance**

- Cache inteligente reduz chamadas à API
- Carregamento offline de dados
- Sincronização otimizada em lote

### 3. **Experiência do Usuário**

- Funcionamento offline completo
- Indicadores visuais de status da rede
- Sincronização automática em background

### 4. **Manutenibilidade**

- Código reutilizável e modular
- Configurações centralizadas
- Padrões consistentes em toda a aplicação

### 5. **Escalabilidade**

- Fácil adição de novas entidades
- Sistema de cache expansível
- Configurações flexíveis por ambiente

## 🔄 Próximos Passos

### 1. Atualizar Telas Restantes

- Implementar contextos nas telas não atualizadas
- Adicionar indicadores de loading e erro
- Implementar refresh automático

### 2. Otimizações de Performance

- Implementar lazy loading para listas grandes
- Otimizar queries de busca
- Implementar paginação

### 3. Funcionalidades Avançadas

- Sistema de notificações push
- Backup automático de dados
- Sincronização seletiva por usuário

### 4. Testes e Monitoramento

- Testes unitários para contextos
- Monitoramento de performance
- Logs detalhados para debug

## 🐛 Solução de Problemas

### Problema: Dados não sincronizam

**Solução**: Verificar configuração da API em `AppConfig.tsx`

### Problema: Cache não funciona

**Solução**: Verificar configurações de TTL e tamanho máximo

### Problema: Performance lenta

**Solução**: Ajustar configurações de cache e sincronização

### Problema: Erro de armazenamento

**Solução**: Verificar limite de AsyncStorage (6MB)

## 📝 Notas Importantes

1. **AsyncStorage**: Limite de 6MB, implementar limpeza automática
2. **Cache**: Configurar TTL apropriado para cada tipo de dado
3. **Sincronização**: Implementar retry e fallback para cenários offline
4. **Performance**: Monitorar uso de memória e otimizar conforme necessário

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Autor**: Equipe SugFlora
