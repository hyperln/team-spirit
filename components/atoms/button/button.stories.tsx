import React, { ReactElement } from 'react';

import { Button } from './button';

export default {
  component: Button,
  title: 'Button',
  excludeStories: /.*Data$/,
};

export const Default = (): ReactElement => (
  <Button onClick={() => console.log('You clicked me!')}>CLICK ME!</Button>
);

export const Inverted = (): ReactElement => (
  <Button inverted onClick={() => console.log('You clicked me!')}>
    Buy
  </Button>
);

export const Secondary = (): ReactElement => (
  <Button color="secondary" onClick={() => console.log('You clicked me!')}>
    Buy
  </Button>
);

export const SecondaryInverted = (): ReactElement => (
  <Button
    color="secondary"
    inverted
    onClick={() => console.log('You clicked me!')}
  >
    Buy
  </Button>
);
