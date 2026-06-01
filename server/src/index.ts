import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createContext, type Context } from './context.js';

async function startServer(): Promise<void> {
  const app = express();

  const server = new ApolloServer<Context>({ typeDefs, resolvers });
  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async () => createContext(),
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => {
    console.log(`🚀 BookShelf API ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
