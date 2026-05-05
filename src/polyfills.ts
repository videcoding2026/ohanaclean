const inMemoryStorage: Record<string, string> = {}

try {
  const testKey = "__lsp__"
  window.localStorage.setItem(testKey, testKey)
  window.localStorage.removeItem(testKey)
} catch {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem(key: string) { return inMemoryStorage[key] ?? null },
      setItem(key: string, value: string) { inMemoryStorage[key] = value },
      removeItem(key: string) { delete inMemoryStorage[key] },
      clear() { Object.keys(inMemoryStorage).forEach((k) => delete inMemoryStorage[k]) },
      get length() { return Object.keys(inMemoryStorage).length },
      key(index: number) { return Object.keys(inMemoryStorage)[index] ?? null },
    },
    writable: false,
    configurable: true,
  })
}
