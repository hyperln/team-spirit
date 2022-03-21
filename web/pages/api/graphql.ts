import { ApolloServer } from 'apollo-server-micro';
import { schema } from '@lib/api/graphql/schema';

const apolloServer = new ApolloServer({
  schema,
  // eslint-disable-next-line arrow-body-style
  context: () => {
    return {};
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
