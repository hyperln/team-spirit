import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Input } from '@components/atoms/input';
import { Text } from '@components/atoms/typography/text';
import { FormControl, FormLabel } from '@components/molecules/form';
import { useGenders } from '@hooks/use-genders';
import { createTeam } from '@lib/db/db';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function RegisterTeamTemplate({ club }: Props) {
  const { genders } = useGenders();

  const addTeam = async (e) => {
    e.preventDefault();
    await createTeam({
      name: e.target.teamName.value,
      gender: e.target.gender.value,
    });
  };

  // save team use gender.id

  return (
    <Flex justifyContent="center">
      <Box>
        <Text>Register team for {club.name}</Text>
        <FormControl>
          <form onSubmit={addTeam}>
            <FormLabel htmlFor="teamName">Team Name</FormLabel>
            <Input required id="teamName" type="text" placeholder="Team Name" />
            {genders?.map((gender) => (
              <Text>{capitalizeFirstLetter(gender.name)}</Text>
            ))}
            <Button type="submit">Add Team</Button>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
