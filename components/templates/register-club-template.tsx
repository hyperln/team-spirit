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
import { createClub } from '@lib/db';
import { Center } from '@components/atoms/center';
import { useToast } from 'team-spirit/hooks/use-toast';
import { useState } from 'react';
import { Spinner } from '@components/atoms/spinner';

export function RegisterClubTemplate() {
  const toast = useToast();
  const [established, setEstablished] = useState(null);
  const [clubName, setClubName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await createClub({
        name: clubName,
        established,
      });

      toast({
        status: 'success',
        description: 'Club has been created!',
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
          <form onSubmit={handleSubmit}>
            <FormLabel textAlign="center" my="2" htmlFor="clubName">
              Register Your Club
            </FormLabel>
            <Input
              onChange={(e) => setClubName(e.target.value)}
              my="2"
              required
              name="clubName"
              id="clubName"
              type="text"
              placeholder="Club Name"
              value={clubName}
            />
            <NumberInput
              defaultValue={currentYear}
              min={1800}
              max={currentYear}
            >
              <NumberInputField
                onChange={(e) => setEstablished(e.target.value)}
                placeholder="Established"
                id="established"
                value={established}
                name="established"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Center>
              <Button
                color="white"
                variant="ghost"
                type="submit"
                isLoading={isLoading}
                my="3"
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
