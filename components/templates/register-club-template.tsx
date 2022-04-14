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
            <Button type="submit">Add Club</Button>
          </form>
        </FormControl>
      </Box>
    </Flex>
  );
}
