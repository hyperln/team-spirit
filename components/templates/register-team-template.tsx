import { useToast } from '@hooks/use-toast';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Input } from '@components/atoms/input';
import { Select } from '@components/atoms/select';
import { Spinner } from '@components/atoms/spinner';
import { Text } from '@components/atoms/typography/text';
import { FormControl, FormLabel } from '@components/molecules/form';
import { useColorModeValue } from '@hooks/use-color-mode';
import { useGenders } from '@hooks/use-genders';
import { createTeam } from '@lib/db/db';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { useState } from 'react';
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function RegisterTeamTemplate({ club }: Props) {
  const toast = useToast();
  const { genders } = useGenders();
  const [gender, setGender] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderSelect = (e) => {
    setGender(e.target.value);
  };

  const formBackground = useColorModeValue(
    'rgb(255,255,255)',
    'rgba(0,0,0,0.4)',
  );

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await createTeam,
        (club.id,
        {
          teamName,
          gender,
        });

      toast({
        status: 'success',
        description: 'Profile has been updated!',
        title: 'Success',
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const addTeam = async (e) => {
  //   e.preventDefault();
  //   await createTeam({
  //     name: e.target.teamName.value,
  //     gender: e.target.genders.value,
  //   });
  // };

  // save team use gender.id

  return (
    <Flex justifyContent="center" minH="calc(100vh - 80px)">
      <Box
        justifyContent={{ base: 'center', lg: 'right' }}
        p="12"
        background={formBackground}
        boxSize="border-box"
      >
        <Text>Register team for {club.name}</Text>
        <FormControl>
          <form onSubmit={handleSubmit}>
            <Box mb="2" position="relative">
              <FormLabel htmlFor="teamName">Team Name</FormLabel>
              <Input
                onChange={(e) => setTeamName(e.target.value)}
                required
                id="teamName"
                type="text"
                placeholder="Team Name"
                name="teamName"
                value={teamName}
              />
            </Box>
            <Box mb="12">
              <Select
                onChange={handleGenderSelect}
                placeholder="Gender"
                variant="flushed"
                value={gender}
              >
                {genders?.map((gender, index) => (
                  <option key={index} value={gender.gender_id}>
                    {capitalizeFirstLetter(gender.name)}
                  </option>
                ))}
              </Select>
            </Box>
            <Button
              type="submit"
              isLoading={isLoading}
              spinner={
                <Spinner
                  color="brand.50"
                  variant="outline"
                  thickness="3.8px"
                  emptyColor="gray.600"
                  speed="0.75s"
                  size="lg"
                />
              }
            >
              Add Team
            </Button>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
