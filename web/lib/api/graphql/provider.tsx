import { ReactElement } from 'react';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const graphqlUrl = '/api/graphql';

export const apiClient = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUrl,
    fetch: async (uri: string, options: RequestInit) => {
      const opts = {
        ...options,
        headers: {
          ...options.headers,
        },
      };
      return fetch(uri, opts);
    },
  }),
  cache: new InMemoryCache(),
});

type Props = {
  children: ReactElement | ReactElement[] | string;
};

export function APIProvider({ children }: Props) {
  return <ApolloProvider client={apiClient}>{children}</ApolloProvider>;
}
