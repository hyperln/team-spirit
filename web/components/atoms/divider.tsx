import { Divider as ChakraDivider } from '@chakra-ui/react';
import { ComponentProps, FC } from 'react';

type Props = ComponentProps<typeof ChakraDivider>;

export const Divider: FC<Props> = (props) => <ChakraDivider {...props} />;
