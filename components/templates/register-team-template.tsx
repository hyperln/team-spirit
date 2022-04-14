import { Box } from '@components/atoms/box';
import { Flex } from '@components/atoms/flex';
import { Text } from '@components/atoms/typography/text';
import { useGenders } from '@hooks/use-genders';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function RegisterTeamTemplate({ club }: Props) {
  const { genders } = useGenders();

  // save team use gender.id

  return (
    <Flex justifyContent="center">
      <Box>
        <Text>Register team for {club.name}</Text>
        {genders?.map((gender) => (
          <Text>{capitalizeFirstLetter(gender.name)}</Text>
        ))}
      </Box>
    </Flex>
  );
}
