import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Heading } from '@components/atoms/typography/heading';
import { Text } from '@components/atoms/typography/text';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function ClubPageTemplate({ club }: Props) {
  const handleJoinClub = async () => {
    console.log('join club');
  };

  return (
    <Flex justifyContent="center">
      <Box display="block">
        <Heading>{club.name}</Heading>
        <Text>{club.established}</Text>
        <Button onClick={handleJoinClub}>Join club</Button>
      </Box>
    </Flex>
  );
}
