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
import { useState } from 'react';
import { useToast } from '@hooks/use-toast';
import { Spinner } from '@components/atoms/spinner';

export function RegisterClubTemplate() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addClub = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      await createClub({
        name: e.target.clubName.value,
        established: e.target.established.value,
      });

      toast({
        status: 'success',
        description: 'Club Has Been Registered!',
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
    <Flex>
      <Box>
        <FormControl>
          <form onSubmit={addClub}>
            <FormLabel htmlFor="clubName">Club Name</FormLabel>
            <Input required id="clubName" type="text" placeholder="Club Name" />
            <NumberInput
              defaultValue={currentYear}
              min={1800}
              max={currentYear}
            >
              <NumberInputField id="established" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
              Add Club
            </Button>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
