// Single GraphQL endpoint, shared by the Apollo HttpLink and the raw-fetch
// refresh call (which deliberately bypasses the link chain).
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql';
