import { mutations } from './resolvers/mutations';
import { queries } from './resolvers/queries';

export const resolvers = {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
};
