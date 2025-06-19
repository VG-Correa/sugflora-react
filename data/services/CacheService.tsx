interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live em milissegundos
}

interface CacheConfig {
  defaultTTL: number; // 5 minutos por padrão
  maxSize: number; // Máximo de itens no cache
  cleanupInterval: number; // Intervalo para limpeza automática
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.cache = new Map();
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutos
      maxSize: 100,
      cleanupInterval: 10 * 60 * 1000, // 10 minutos
    };
    this.startCleanupTimer();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Configurar o cache
  public configure(config: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Salvar item no cache
  public set<T>(key: string, data: T, ttl?: number): void {
    try {
      // Verificar se o cache está cheio
      if (this.cache.size >= this.config.maxSize) {
        this.evictOldest();
      }

      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
      };

      this.cache.set(key, item);
      console.log(`Item salvo no cache: ${key}`);
    } catch (error) {
      console.error(`Erro ao salvar item no cache (${key}):`, error);
    }
  }

  // Obter item do cache
  public get<T>(key: string): T | null {
    try {
      const item = this.cache.get(key);

      if (!item) {
        return null;
      }

      // Verificar se o item expirou
      if (this.isExpired(item)) {
        this.cache.delete(key);
        return null;
      }

      console.log(`Item encontrado no cache: ${key}`);
      return item.data as T;
    } catch (error) {
      console.error(`Erro ao obter item do cache (${key}):`, error);
      return null;
    }
  }

  // Verificar se item existe no cache
  public has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Remover item do cache
  public delete(key: string): boolean {
    try {
      const deleted = this.cache.delete(key);
      if (deleted) {
        console.log(`Item removido do cache: ${key}`);
      }
      return deleted;
    } catch (error) {
      console.error(`Erro ao remover item do cache (${key}):`, error);
      return false;
    }
  }

  // Limpar todo o cache
  public clear(): void {
    try {
      this.cache.clear();
      console.log("Cache limpo completamente");
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
    }
  }

  // Obter estatísticas do cache
  public getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
  } {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? this.stats.misses / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      missRate,
    };
  }

  // Verificar se item expirou
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  // Remover item mais antigo
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`Item mais antigo removido do cache: ${oldestKey}`);
    }
  }

  // Limpeza automática de itens expirados
  private cleanup(): void {
    try {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, item] of this.cache.entries()) {
        if (this.isExpired(item)) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`${cleanedCount} itens expirados removidos do cache`);
      }
    } catch (error) {
      console.error("Erro na limpeza automática do cache:", error);
    }
  }

  // Iniciar timer de limpeza automática
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  // Parar timer de limpeza automática
  public stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  // Estatísticas do cache
  private stats = {
    hits: 0,
    misses: 0,
  };

  // Método wrapper para get com estatísticas
  public getWithStats<T>(key: string): T | null {
    const result = this.get<T>(key);
    if (result !== null) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    return result;
  }

  // Métodos específicos para entidades do SugFlora
  public setUsuarios(usuarios: any[]): void {
    this.set("usuarios", usuarios, 10 * 60 * 1000); // 10 minutos
  }

  public getUsuarios(): any[] | null {
    return this.getWithStats<any[]>("usuarios");
  }

  public setProjetos(projetos: any[]): void {
    this.set("projetos", projetos, 5 * 60 * 1000); // 5 minutos
  }

  public getProjetos(): any[] | null {
    return this.getWithStats<any[]>("projetos");
  }

  public setCampos(campos: any[]): void {
    this.set("campos", campos, 5 * 60 * 1000); // 5 minutos
  }

  public getCampos(): any[] | null {
    return this.getWithStats<any[]>("campos");
  }

  public setColetas(coletas: any[]): void {
    this.set("coletas", coletas, 3 * 60 * 1000); // 3 minutos
  }

  public getColetas(): any[] | null {
    return this.getWithStats<any[]>("coletas");
  }

  public setFamilias(familias: any[]): void {
    this.set("familias", familias, 30 * 60 * 1000); // 30 minutos (dados mais estáticos)
  }

  public getFamilias(): any[] | null {
    return this.getWithStats<any[]>("familias");
  }

  public setGeneros(generos: any[]): void {
    this.set("generos", generos, 30 * 60 * 1000); // 30 minutos
  }

  public getGeneros(): any[] | null {
    return this.getWithStats<any[]>("generos");
  }

  public setEspecies(especies: any[]): void {
    this.set("especies", especies, 30 * 60 * 1000); // 30 minutos
  }

  public getEspecies(): any[] | null {
    return this.getWithStats<any[]>("especies");
  }

  // Cache de busca de espécies
  public setEspecieSearch(query: string, results: any[]): void {
    this.set(`especie_search_${query.toLowerCase()}`, results, 15 * 60 * 1000); // 15 minutos
  }

  public getEspecieSearch(query: string): any[] | null {
    return this.getWithStats<any[]>(`especie_search_${query.toLowerCase()}`);
  }

  // Cache de campos por usuário
  public setCamposByUsuario(userId: string, campos: any[]): void {
    this.set(`campos_user_${userId}`, campos, 5 * 60 * 1000); // 5 minutos
  }

  public getCamposByUsuario(userId: string): any[] | null {
    return this.getWithStats<any[]>(`campos_user_${userId}`);
  }

  // Cache de coletas por campo
  public setColetasByCampo(campoId: number, coletas: any[]): void {
    this.set(`coletas_campo_${campoId}`, coletas, 3 * 60 * 1000); // 3 minutos
  }

  public getColetasByCampo(campoId: number): any[] | null {
    return this.getWithStats<any[]>(`coletas_campo_${campoId}`);
  }

  // Invalidar cache relacionado
  public invalidateRelated(key: string): void {
    const keysToDelete: string[] = [];

    for (const cacheKey of this.cache.keys()) {
      if (
        cacheKey.includes(key) ||
        cacheKey.includes("campos") ||
        cacheKey.includes("coletas")
      ) {
        keysToDelete.push(cacheKey);
      }
    }

    keysToDelete.forEach((k) => this.delete(k));
    console.log(`Cache relacionado invalidado para: ${key}`);
  }
}

export default CacheService;
