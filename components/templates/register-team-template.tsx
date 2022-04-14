import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Text } from '@components/atoms/typography/text';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function RegisterTeamTemplate({ club }: Props) {
  return (
    <Flex justifyContent="center">
      <Box>
        <Text>Register team for {club.name}</Text>
      </Box>
    </Flex>
  );
}
