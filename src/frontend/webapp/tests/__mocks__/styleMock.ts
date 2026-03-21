// CSS module mock — returns a Proxy that echoes class names
const handler: ProxyHandler<Record<string, string>> = {
  get: (_, prop) => (typeof prop === 'string' ? prop : ''),
};
export default new Proxy({} as Record<string, string>, handler);
