import { useRouter } from 'next/router';
import { Button } from '@components/atoms/button';
import { Heading } from '../atoms/typography/heading';

export function PageHeader({ props }) {
  const router = useRouter();

  return (
    <>
      <Button
        outline="0"
        _focus={{ boxShadow: '0 0 0 0px' }}
        display={{ lg: 'none' }}
        textColor="brand"
        variant="unstyled"
        aria-label="Back"
        onClick={() => router.back()}
      >
        Back
      </Button>
      <Heading>{props.title}</Heading>
    </>
  );
}
