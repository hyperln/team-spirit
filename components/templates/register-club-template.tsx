import { Flex } from '@components/atoms/flex';
import { Box } from '@components/atoms/box';
import { Input } from '@components/atoms/input';
import { Button } from '@components/atoms/button';
import { FormControl, FormLabel } from '@components/molecules/form';
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@components/molecules/number-input';
import { createClub, joinClub } from '@lib/db';
import { Center } from '@components/atoms/center';
import { useToast } from '@hooks/use-toast';
import { useState } from 'react';
import { Spinner } from '@components/atoms/spinner';

export function RegisterClubTemplate() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addClub = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const club = await createClub({
        name: e.target.clubName.value,
        established: e.target.established.value,
      });
      await joinClub(club.id);
      toast({
        status: 'success',
        description: 'Club has been registered',
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

  const currentYear = new Date().getFullYear();

  return (
    <Flex justifyContent="center" minH="calc(100vh - 80px)">
      <Box>
        <FormControl>
          <form onSubmit={addClub}>
            <FormLabel textAlign="center" my="2" htmlFor="clubName">
              Register Your Club
            </FormLabel>
            <Input
              my="2"
              required
              id="clubName"
              type="text"
              placeholder="Club Name"
            />
            <NumberInput
              defaultValue={currentYear}
              min={1800}
              max={currentYear}
            >
              <NumberInputField placeholder="Established" id="established" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Center>
              <Button
                isLoading={isLoading}
                color="white"
                variant="ghost"
                my="3"
                type="submit"
                spinner={<Spinner size="lg" />}
              >
                Register Club
              </Button>
            </Center>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
