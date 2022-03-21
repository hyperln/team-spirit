import { ReactElement } from 'react';
import { Box } from '@components/atoms/box';
import { Icon } from '@components/atoms/icon/icon';
import { Link } from '@components/atoms/link/link';
import { theme } from '@theme/theme';

type Props = {
  href: string;
  children: ReactElement | ReactElement[] | string;
  color?: string;
};

export function BackLink({ href, children, color = theme.colors.link }: Props) {
  return (
    <Box
      pad={{ vertical: 'small', horizontal: 'large' }}
      align="center"
      direction="row"
    >
      <Icon height={20} width={20} src="/icons/caret-left.svg" />
      <Link color={color} href={href}>
        {children}
      </Link>
    </Box>
  );
}
