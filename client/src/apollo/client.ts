import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql',
});

// Runs before every request: inject the access token if we have one.
const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
