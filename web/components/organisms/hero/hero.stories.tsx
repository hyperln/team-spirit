import React, { ReactElement } from 'react';

import { Hero } from './hero';

export default {
  component: Hero,
  title: 'Hero',
  excludeStories: /.*Data$/,
};

export const Default = (): ReactElement => <Hero />;
