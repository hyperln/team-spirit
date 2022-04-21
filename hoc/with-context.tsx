import { ComponentType, FC, ReactElement } from 'react';

type Props = any;

export const withContext =
  <P extends object>(
    Component: ComponentType<P>,
    Context: ComponentType<{ children: ReactElement | ReactElement[] }>,
  ): FC<P & Props> =>
  (props: Props) => {
    return (
      <Context>
        <Component {...props} />
      </Context>
    );
  };
