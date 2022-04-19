import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Input } from '@components/atoms/input';
import { HStack } from '@components/atoms/stack';
import { Heading } from '@components/atoms/typography/heading';
import { FormControl, FormLabel } from '@components/molecules/form';
import { FormEvent } from 'react';

export function AddPaymentMethodTemplate() {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { ...inputs } = e.target;
    const values = Object.entries(inputs)
      .map(([, value]) =>
        value.value
          ? {
              value: value.value,
              name: value.id,
            }
          : false,
      )
      .filter(Boolean);

    console.log('values :>> ', values);
  };

  return (
    <Box>
      <Heading textAlign="center" size="md">
        Add payment method
      </Heading>
      <Box mx="8" my="4">
        <form onSubmit={handleSubmit}>
          <FormControl my="4">
            <FormLabel htmlFor="address1">Address</FormLabel>
            <Input id="address1" type="text" />
            <FormLabel htmlFor="address2">Address line 2</FormLabel>
            <Input id="address2" type="text" />
            <FormLabel htmlFor="city">City</FormLabel>
            <Input id="city" type="text" />
            <FormLabel htmlFor="country">Country</FormLabel>
            <Input id="country" type="text" />
            <HStack>
              <span>
                <FormLabel htmlFor="postcode">Post Code</FormLabel>
                <Input id="postcode" type="text" />
              </span>
              <span>
                <FormLabel htmlFor="state">State</FormLabel>
                <Input id="state" type="text" />
              </span>
            </HStack>
          </FormControl>
          <Button w="full" type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}
