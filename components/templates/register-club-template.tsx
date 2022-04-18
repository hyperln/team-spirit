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

export function RegisterClubTemplate() {
  const addClub = async (e) => {
    e.preventDefault();
    await createClub({
      name: e.target.clubName.value,
      established: e.target.established.value,
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <Flex
      justifyContent="center"
      minH="calc(100vh - 80px)"
      bgGradient="linear(brand.900 10%, brand.600 60%)"
    >
      <Box>
        <FormControl>
          <form onSubmit={addClub}>
            <FormLabel textAlign="center" my="2" htmlFor="clubName">
              Club Name
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
              <NumberInputField id="established" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Center>
              <Button my="3" type="submit">
                Add Club
              </Button>
            </Center>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
