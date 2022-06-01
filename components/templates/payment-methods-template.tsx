import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { Heading } from '@components/atoms/typography/heading';
import { PageHeader } from '@components/organisms/pageheader';

export function PaymentMethodsTemplate() {
  return (
    <Flex justifyContent="center" flexDir="column" alignItems="center" gap="6">
      <PageHeader title="Your payment methods" backgroundColor="white" />
      
      <Button
        color="white"
        variant="ghost"
        as={Link}
        href="/account/payment-methods/add"
      >
        Add payment method
      </Button>
    </Flex>
  );
}
