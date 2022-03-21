import React, { ReactElement } from 'react';

import { Image } from './image';

export default {
  component: Image,
  title: 'Image',
  excludeStories: /.*Data$/,
};

export const Default = (): ReactElement => (
  <Image
    width={400}
    src="https://cdn.sanity.io/images/x18kfhdc/production/d604bb0960a164c0e5283ecb72b7db834ebf29ba-5092x3395.jpg"
  />
);
