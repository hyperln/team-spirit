import React, { ReactElement } from 'react';

import { Input } from './input';

export default {
  component: Input,
  title: 'Input',
  excludeStories: /.*Data$/,
};

export const Default = (): ReactElement => <Input type="text" />;
