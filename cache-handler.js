class CacheHandler {
  constructor(options) {
    this.options = options;
    this.cache = new Map();
  }

  async get(key) {
    const data = this.cache.get(key);
    if (!data) return null;

    return {
      value: data.value,
      lastModified: data.lastModified ?? Date.now(),
    };
  }

  async set(key, data, options) {
    // Não armazena em cache respostas do Sanity
    if (key.includes('sanity.io')) {
      return;
    }

    this.cache.set(key, {
      value: data,
      lastModified: Date.now(),
    });
  }
}

module.exports = CacheHandler; 