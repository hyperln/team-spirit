import { useEffect, useRef, useState } from 'react';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@components/molecules/form';
import { Input, InputGroup, InputRightElement } from '@components/atoms/input';
import { Center } from '@components/atoms/center';
import { Text } from '@components/atoms/typography/text';
import { useAuth } from '@hooks/use-auth';

import { useForm } from '@hooks/use-form';
import { Flex } from '@components/atoms/flex';
import { Link } from '@components/atoms/link';
import { CheckBox } from '@components/atoms/checkbox';
import React from 'react';
import { Spinner } from '@components/atoms/spinner';
import { client } from '@lib/db/client';
import { emit } from 'process';
import { resetPassword } from '../../lib/auth/auth';

enum Steps {
  login = 'login',
  register = 'register',
  resetPassword = 'reset password',
}

const instructions = {
  [Steps.login]: 'Login',
  [Steps.register]: 'Sign Up',
  [Steps.resetPassword]: 'Reset Password',
};

export function AuthScreen() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const [step, setStep] = useState(Steps.register);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (e) => {
    setIsLoading(true);
    switch (step) {
      case Steps.login:
        await auth.signIn({ email: e.email, password: e.password });
        setIsLoading(false);
        break;
      case Steps.register:
        await auth.signUp({ email: e.email, password: e.password });
        setIsLoading(false);
        break;
      case Steps.resetPassword:
        await auth.resetPassword({ email: e.email });
        setIsLoading(false);
        break;
      default:
        break;
    }
  };

  return (
    <Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex mb="12" top="5" justifyContent="flex-start" position="relative">
          <Text
            flex="0 1 auto"
            position="absolute"
            alignSelf="center"
            fontSize="3xl"
            fontWeight="semibold"
            textAlign="center"
            left="50%"
            transform="translateX(-50%)"
          >
            {instructions[step]}
          </Text>
          <Button
            justifyContent="center"
            size="sm"
            flex="0 1"
            ml="auto"
            alignSelf="flex-end"
            bg="transparent"
            color="brand"
            variant="ghost"
            onClick={() =>
              setStep((prevStep) =>
                prevStep === Steps.login ? Steps.register : Steps.login,
              )
            }
          >
            {step === Steps.login ? `Sign Up` : 'Login'}
          </Button>
        </Flex>
        <Box mt="4" w="xs" d="flex" flexDirection="column" gridGap="3">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              name="email"
              bg="gray.50"
              type="email"
              {...register('email', {
                required: true,
              })}
              isInvalid={errors.email}
              id="email"
              placeholder="Email"
              pr="12"
            />
            {step === Steps.login || step === Steps.register ? (
              <FormLabel htmlFor="password">Password</FormLabel>
            ) : null}
            {step === Steps.login || step === Steps.register ? (
              <InputGroup size="md">
                <Input
                  name="password"
                  bg="gray.50"
                  placeholder="Password"
                  pr="12"
                  type={show ? 'text' : 'password'}
                  {...register('password', {
                    required: step === Steps.login || step === Steps.register,
                    minLength:
                      step !== Steps.login
                        ? {
                            value: 7,
                            message: 'Passwords must be at least 7 characters',
                          }
                        : undefined,
                    pattern:
                      step !== Steps.login
                        ? {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
                            message:
                              'Passwords must contain at least one letter and one number',
                          }
                        : undefined,
                  })}
                  isInvalid={errors.password}
                  id="password"
                />
                <InputRightElement w="12">
                  <Button
                    bg="transparent"
                    color="brand"
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                  >
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            ) : null}
            {step === Steps.register ? (
              <>
                <FormLabel htmlFor="password2">Repeat password</FormLabel>
                <InputGroup size="md">
                  <Input
                    name="password2"
                    bg="gray.50"
                    {...register('password2', {
                      required: step === Steps.register,
                      validate: (value) => {
                        return (
                          value === password.current ||
                          'The passwords do not match'
                        );
                      },
                    })}
                    isInvalid={errors.password2}
                    id="password2"
                    placeholder="Repeat Password"
                    pr="12"
                    type={show ? 'text' : 'password'}
                  />
                  <InputRightElement w="12">
                    <Button
                      bg="transparent"
                      color="brand"
                      h="1.75rem"
                      size="sm"
                      onClick={handleClick}
                    >
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </>
            ) : null}
            <Text position="absolute" color="red.500">
              {errors.email?.message ||
                errors.password?.message ||
                errors.password2?.message}
            </Text>
          </FormControl>
        </Box>
        <Flex
          bottom="-100"
          position="relative"
          justifyContent=""
          flexDir="column"
        >
          <Button
            type="submit"
            w="full"
            color="white"
            variant="ghost"
            aria-label="submit"
            isLoading={isLoading}
            spinner={<Spinner size="lg" />}
            bottom="1"
          >
            {step === Steps.register
              ? `Sign Up`
              : step === Steps.login
              ? `Login`
              : `Reset Password`}
          </Button>
          {step === Steps.login || step === Steps.register ? (
            <Link
              mt="5"
              href="#"
              color="brand"
              alignContent="center"
              alignSelf="center"
              justifyItems="center"
              onClick={() => setStep(Steps.resetPassword)}
            >
              Forgot your password?
            </Link>
          ) : null}
        </Flex>
      </form>
    </Center>
  );
}
