import { Page } from '@lib/cms/cms-types';
import { Sections } from '@components/templates/sections';
import { useAuth } from '@hooks/use-auth';
import { Button } from '@components/atoms/button/button';
import { useState } from 'react';
import { Box } from '@components/atoms/box';
import { Center } from '@components/atoms/layout';

type Props = Page & {
  content: Page;
};

export default function AccountPageTemplate({ content, ...props }: Props) {
  const { signOut } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <main>
      <Box width="full">
        <Center>
          <Button isLoading={isLoading} onClick={handleSignOut}>
            Log out
          </Button>
        </Center>
      </Box>
      <Sections {...props} {...content} sections={content.sections} />
    </main>
  );
}
