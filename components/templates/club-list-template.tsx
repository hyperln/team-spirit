import { Box } from '@components/atoms/box';
import { Link } from '@components/atoms/link';
import { ListItem, List } from '@components/atoms/list';
import { Heading } from '@components/atoms/typography/heading';
import { HStack } from '@components/atoms/stack';
import { Center } from '@components/atoms/center';
import { Text } from '@components/atoms/typography/text';
import { useEffect, useState } from 'react';
import { getLogoImage } from '@lib/storage/storage';
import { Avatar } from '@components/molecules/avatar-image';
import { Icon } from '@components/atoms/icon';
import { PageHeader } from '@components/organisms/pageheader';
import { getContrastingTextColor } from '@utils/color-utils';

function ClubListing({ club }) {
  const [logoUrl, setLogoUrl] = useState('');

  const fetchLogoUrl = async () => {
    const { signedURL } = await getLogoImage(club.logoImageId);
    setLogoUrl(signedURL);
  };

  useEffect(() => {
    if (club.logoImageId) {
      fetchLogoUrl();
    }
  }, [club.logoImageId]);

  return (
    <HStack>
      <Box mt="2" w="16" h="16">
        <Center>
          {logoUrl ? (
            <Avatar
              borderRadius="15%"
              borderColor="white"
              showBorder
              size="md"
              src={logoUrl}
            />
          ) : (
            <Icon src="/icons/logo-fallback.svg" />
          )}
        </Center>
      </Box>
      <Box w="80">
        <ListItem width="72" borderBottom="1px" h="16" key={club.id}>
          <Link href={`/clubs/${club.id}`}>
            <Text letterSpacing="wide" fontSize="lg" fontWeight="bold">
              {club.name}
            </Text>
            <Text fontWeight="semibold">{club.established}</Text>
          </Link>
        </ListItem>
      </Box>
    </HStack>
  );
}

export function ClubListTemplate({ clubs }) {
  return (
    <List>
      <PageHeader
        title={'Clubs'}
        backgroundColor={'white'}
        secondaryAction={<Text>Filter</Text>}
      />

      {clubs.map((club) => (
        <ClubListing club={club} />
      ))}
    </List>
  );
}
