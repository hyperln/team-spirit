import { useCookies } from 'react-cookie';
import { Box } from '@components/atoms/box';
import { Portal } from '@components/atoms/portal';
import { Slide } from '@components/atoms/transitions';
import { useLayoutData } from '@hooks/use-layout-data';
import { config } from 'config';
import { Text } from '@components/atoms/typography/text';
import { Heading } from '@components/atoms/typography/heading';
import { BlockContent } from '@components/molecules/block-content/block-content';
import { Button } from '@components/atoms/button/button';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { getDateInDaysFromNow } from '@utils/time';
import { useState } from 'react';
import { useDisclosure } from '@hooks/use-disclosure';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@components/atoms/modal';
import { BodyContent } from '@lib/cms/cms-types';
import { Link } from '@components/atoms/link/link';
import { Divider } from '@components/atoms/divider';
import { Switch } from '@components/atoms/form-elements';
import { Center } from '@components/atoms/layout';
import { useColorMode } from '@hooks/use-color-mode';
import { Themes } from '@state/theme-types';
import { Image } from '@components/atoms/image/image';
import { cmsFactory } from '@lib/cms/cms';
import { Table, Tbody, Td, Th, Thead, Tr } from '@components/molecules/table';
import { capitalizeFirstLetter } from '@utils/string-utils';
import { useMediaQuery } from '@hooks/use-media-query';
import { Flex } from '@components/atoms/flex';
import { Spacer } from '@components/atoms/spacer';

type CookieDetailsType = {
  _key: string;
  _type: string;
  expiresIn: string;
  name: string;
  provider: string;
  purpose: {
    _key: string;
    _type: string;
    children: {
      _key: string;
      _type: string;
      marks: any[];
      text: string;
    }[];
    markDefs: any[];
    style: string;
  }[];
  type: string;
};

type CookiePreferenceType = {
  _key: string;
  _type: string;
  cookieDetails: CookieDetailsType[];
  description: BodyContent[];
  title: string;
  required: boolean;
};

function CookieDetails({
  cookieDetails,
}: {
  cookieDetails: CookieDetailsType[];
}) {
  const ignoredKeys = ['_key', '_type'];
  const tableHeadings = Object.keys(cookieDetails[0]).filter(
    (key) => !ignoredKeys.includes(key),
  );
  return (
    <Box overflowX="scroll">
      <Table>
        <Thead>
          <Tr>
            {tableHeadings.map((tableHeading) => (
              <Th key={tableHeading}>{capitalizeFirstLetter(tableHeading)}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {cookieDetails.map((cookieDetail) => (
            <Tr key={cookieDetail._key}>
              {Object.entries(cookieDetail).map(([key, value]) =>
                !ignoredKeys.includes(key) ? <Td key={key}>{value}</Td> : null,
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

type PreferenceProps = CookiePreferenceType & {
  onChangeAccept: (name: string) => void;
  accepted: boolean;
};

function CookiePreference({
  onChangeAccept,
  accepted,
  ...cookiePreference
}: PreferenceProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleShowDetails = () =>
    setShowDetails((prevShowDetails) => !prevShowDetails);

  const handleToggleAccept = () => {
    onChangeAccept(cookiePreference.title);
  };

  return (
    <>
      <Divider pt="4" mb="2" />
      <Box d="flex">
        <Center gridGap="2">
          <Heading size="sm" as="h6">
            {cookiePreference.title} ({cookiePreference.cookieDetails.length})
          </Heading>
          <Button
            onClick={handleToggleShowDetails}
            size="sm"
            rightIcon={!showDetails ? <ArrowForwardIcon /> : null}
            leftIcon={showDetails ? <ArrowBackIcon /> : null}
            variant="ghost"
          >
            {!showDetails ? 'Details' : 'Back'}
          </Button>
        </Center>
      </Box>
      {showDetails ? (
        <CookieDetails cookieDetails={cookiePreference.cookieDetails} />
      ) : (
        <Box d="flex" gridGap="5">
          <Box>
            <BlockContent blocks={cookiePreference.description} />
          </Box>
          <Spacer />
          <Center mr="2">
            <Switch
              onChange={handleToggleAccept}
              defaultIsChecked
              isChecked={accepted}
              isDisabled={cookiePreference.required}
            />
          </Center>
        </Box>
      )}
    </>
  );
}

export function CookieConsent() {
  const { cookieConsent } = useLayoutData();
  const { colorMode } = useColorMode();
  const [isSmallScreen] = useMediaQuery('(max-width: 800px)');
  const [cookies, setCookie] = useCookies([config.cookies.comingSoon.name]);
  const [showCookieConsent, setShowCookieConsent] = useState(
    !cookies[config.cookies.acceptCookies.name],
  );

  const initialCookiePreferences = cookieConsent.cookiePreferences.reduce(
    (acc, current) => ({
      ...acc,
      [current.title.toLowerCase()]: true,
    }),
    {},
  );
  const [acceptedCookies, setAcceptedCookies] = useState(
    initialCookiePreferences,
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClickAccept = () => {
    const cookieValue = Object.entries(acceptedCookies)
      .map(([key, value]) => {
        if (value) {
          return key;
        }
        return false;
      })
      .filter(Boolean)
      .join(',');

    setCookie(config.cookies.acceptCookies.name, cookieValue, {
      sameSite: true,
      path: '/',
      expires: getDateInDaysFromNow(config.cookies.acceptCookies.lifetime),
    });
    setShowCookieConsent(false);
  };

  const handleSaveChanges = () => {
    onClose();
  };

  const handleDiscardChanges = () => {
    setAcceptedCookies(initialCookiePreferences);
    setTimeout(() => {
      onClose();
    }, 1000); // give user time to see changes discarded
  };

  const handleChangeAccept = (name: string) => {
    setAcceptedCookies((prevState) => ({
      ...prevState,
      [name.toLowerCase()]: !prevState[name.toLowerCase()],
    }));
  };

  return (
    <Portal>
      <Slide
        direction="bottom"
        in={showCookieConsent}
        style={{ zIndex: 10 }}
        unmountOnExit
      >
        <Box d="flex" justifyContent="center" w="full">
          <Box
            backgroundColor={colorMode === Themes.light ? 'white' : 'brand.900'}
            boxShadow="md"
            minW={isSmallScreen ? 'sm' : 'lg'}
            borderColor="gray.300"
            borderWidth="1px"
            borderRadius="md"
            mb="2"
            px="8"
            py="5"
            gridGap="3"
            d="flex"
            flexDirection="column"
          >
            <Box d="flex" flexDirection="column" gridGap="2">
              <Box d="flex">
                <Center gridGap="2">
                  <Image
                    h="25px"
                    w="25px"
                    alt={cookieConsent.icon.alt}
                    src={cmsFactory({})
                      .getUrlForImage(cookieConsent.icon.asset)
                      .width(25)
                      .height(25)
                      .url()}
                  />
                  <Heading size="md" as="h5">
                    {cookieConsent.title}
                  </Heading>
                </Center>
              </Box>
              <BlockContent blocks={cookieConsent.description} />
            </Box>
            <Box w="100%" justifyContent="center" d="flex" gridGap="5">
              <Button onClick={onOpen} w="full" leftIcon={<SettingsIcon />}>
                Preferences
              </Button>
              <Button onClick={handleClickAccept} w="full" colorScheme="brand">
                Accept
              </Button>
            </Box>
          </Box>
        </Box>
      </Slide>
      <Modal size="xl" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gridGap="2" alignItems="center">
              <SettingsIcon />
              Cookie preferences
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <BlockContent blocks={cookieConsent.description} />
            <Text>
              You can learn more about how we use cookies by visiting our{' '}
              <Link href={cookieConsent.cookiePolicyLink.slug}>
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href={cookieConsent.privacyPolicyLink.slug}>
                Privacy Policy
              </Link>
              .
            </Text>
            <Box>
              {cookieConsent.cookiePreferences.map((cookiePreference) => (
                <CookiePreference
                  onChangeAccept={handleChangeAccept}
                  accepted={
                    acceptedCookies[cookiePreference.title.toLowerCase()]
                  }
                  key={cookiePreference._key}
                  {...((cookiePreference as unknown) as PreferenceProps)}
                />
              ))}
            </Box>
            <Divider pt="4" />
          </ModalBody>

          <ModalFooter>
            <Box d="flex" gridGap="5">
              <Button onClick={handleDiscardChanges} variant="ghost">
                Discard changes
              </Button>
              <Button colorScheme="brand" mr={3} onClick={handleSaveChanges}>
                Save and close
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
}
