export const environment = {
  production: false,
  // Path relativo: in dev passa dal proxy (proxy.conf.json -> localhost:8080) così le
  // richieste sono same-origin e Angular allega automaticamente l'header X-XSRF-TOKEN.
  apiUrl: '/api'
};
