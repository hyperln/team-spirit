import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { Heading } from '@components/atoms/typography/heading';

export function PaymentMethodsTemplate() {
  return (
    <Flex justifyContent="center" flexDir="column" alignItems="center" gap="6">
      <Heading size="md">Your payment methods</Heading>
      <Button as={Link} href="/account/payment-methods/add">
        Add payment method
      </Button>
    </Flex>
  );
}
