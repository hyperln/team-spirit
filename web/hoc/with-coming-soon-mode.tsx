import {
  ChangeEvent,
  ComponentType,
  FC,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { useCookies } from 'react-cookie';
import { BeatLoader } from '@components/atoms/spinners';
import { config } from 'config';
import { Text } from '@components/atoms/typography/text';
import { Input } from '@components/atoms/input/input';
import { Button } from '@components/atoms/button/button';
import { useColorMode } from '@hooks/use-color-mode';
import { Themes } from '@state/theme-types';
import { useComingSoonLoginMutation } from '@lib/api/graphql/schema/mutations.graphql';
import { useVerifyComingSoonLoginLazyQuery } from '@lib/api/graphql/schema/queries.graphql';
import { getDateInDaysFromNow } from '@utils/time';
import { Box } from '@components/atoms/box';
import { Center } from '@components/atoms/layout';
import { colors } from '@theme/theme';

const IS_PASSWORD_PROTECT_ON = process.env.NEXT_PUBLIC_PASSWORD_PROTECT_ON;

export const withComingSoonMode = <P extends object>(
  Component: ComponentType<P>,
): FC<P> => (props: P) => {
  const { setColorMode } = useColorMode();
  const [cookies, setCookie, removeCookie] = useCookies([
    config.cookies.comingSoon.name,
  ]);
  const [password, setPassword] = useState('');
  const [
    comingSoonLoginMutation,
    { loading: isComingSoonLoginLoading },
  ] = useComingSoonLoginMutation();

  const [
    verifyComingSoonLogin,
    {
      data: verifyComingSoonLoginData,
      loading: isLoadingVerifyComingSoonLogin,
    },
  ] = useVerifyComingSoonLoginLazyQuery();

  useEffect(() => {
    setColorMode(Themes.light);
  }, []);

  const verifyAuth = async () => {
    verifyComingSoonLogin({
      variables: { input: { token: cookies[config.cookies.comingSoon.name] } },
    });
  };

  useEffect(() => {
    if (
      !isLoadingVerifyComingSoonLogin &&
      verifyComingSoonLoginData &&
      !verifyComingSoonLoginData.verifyComingSoonLogin
    )
      removeCookie(config.cookies.comingSoon.name, {
        sameSite: true,
        path: '/',
        expires: getDateInDaysFromNow(config.cookies.comingSoon.lifetime),
      });
  }, [verifyComingSoonLoginData, isLoadingVerifyComingSoonLogin]);

  useEffect(() => {
    if (IS_PASSWORD_PROTECT_ON && cookies[config.cookies.comingSoon.name]) {
      verifyAuth();
    }
  }, [cookies]);

  const isBlocked = () =>
    IS_PASSWORD_PROTECT_ON && !cookies[config.cookies.comingSoon.name];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      data: { comingSoonLogin: authed },
    } = await comingSoonLoginMutation({ variables: { input: { password } } });
    if (authed)
      setCookie(config.cookies.comingSoon.name, authed, {
        sameSite: true,
        path: '/',
        expires: getDateInDaysFromNow(config.cookies.comingSoon.lifetime),
      });
  };

  return (
    <Box>
      {isComingSoonLoginLoading || isLoadingVerifyComingSoonLogin ? (
        <Center h="100vh">
          <Box>
            <Box pb="5" d="flex" justifyContent="center">
              <BeatLoader size={50} margin={3} color={colors.brand['50']} />
            </Box>
            <Text fontSize="4xl">
              Coming soon mode is active. Checking access...
            </Text>
          </Box>
        </Center>
      ) : isBlocked() ? (
        <Center h="100vh">
          <Box>
            <form onSubmit={handleSubmit}>
              <Text>
                Coming soon mode is active. Please log in to preview the site.
              </Text>
              <Box gridGap="1" d="flex">
                <Input
                  onChange={handleChange}
                  name="password"
                  required
                  type="password"
                  autoFocus
                />
                <Button disabled={!password} colorScheme="brand" type="submit">
                  Log in
                </Button>
              </Box>
            </form>
          </Box>
        </Center>
      ) : (
        <Component {...(props as P)} />
      )}
    </Box>
  );
};
