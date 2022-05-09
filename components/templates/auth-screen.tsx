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

enum Steps {
  login = 'login',
  register = 'register',
  registerRepeatPassword = 'registerRepeatPassword',
}

const instructions = {
  [Steps.login]: 'Login',
  [Steps.register]: 'Sign Up',
  [Steps.registerRepeatPassword]: 'Sign Up',
};

// enum Fields {
//   email = 'email',
//   password = 'password',
//   password2 = 'password2',
// }

// const fieldNames = Object.keys(Fields).map((key) => key);

// type Refs = {
//   'email?': { current: any; [key: string]: any };
//   'password?': { current: any; [key: string]: any };
//   'password2?': { current: any; [key: string]: any };
// };

// const fields = [
//   {
//     name: Fields.email,
//     showFor: Object.keys(Steps).map((key) => key),
//     currentStep: [Steps.register],
//     showSubmitButtonFor: [],
//     placeholder: 'Email',
//     inputType: 'email',
//   },
//   {
//     name: Fields.password,
//     showFor: Object.keys(Steps).map((key) => key),
//     currentStep: [Steps.register, Steps.login],
//     showSubmitButtonFor: [Steps.login],
//     placeholder: 'Password',
//     inputType: 'password',
//   },
//   {
//     name: Fields.password2,
//     showFor: [Steps.register, Steps.registerRepeatPassword],
//     currentStep: [Steps.registerRepeatPassword],
//     showSubmitButtonFor: [Steps.registerRepeatPassword, Steps.register],
//     placeholder: 'Repeat Password',
//     inputType: 'password',
//   },
// ];

export function AuthScreen() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const [step, setStep] = useState(Steps.login);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = useRef({});
  password.current = watch('password', '');

  // const refs: Refs = fieldNames.reduce((acc, curr) => {
  //   const ref = useRef();
  //   return {
  //     ...acc,
  //     [curr]: ref,
  //   };
  // }, {});

  // const formRefs = {
  //   email: register('email', {
  //     required: true,
  //   }),
  //   password: register('password', {
  //     required: true,
  //     minLength:
  //       step !== Steps.login
  //         ? {
  //             value: 7,
  //             message: 'Passwords must be at least 7 characters',
  //           }
  //         : null,
  //     pattern:
  //       step !== Steps.login
  //         ? {
  //             value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
  //             message:
  //               'Passwords must contain at least one letter and one number',
  //           }
  //         : null,
  //   }),
  //   password2: register('password2', {
  //     required: step === Steps.registerRepeatPassword,
  //     validate: (value) =>
  //       [Steps.registerRepeatPassword, Steps.register].includes(step)
  //         ? value === password.current || 'The passwords do not match'
  //         : null,
  //   }),
  // };

  useEffect(() => {
    switch (step) {
      // case Steps.checkEmail:
      //   refs.email.current?.focus();
      //   break;
      // case Steps.login:
      // case Steps.register:
      //   refs.password.current?.focus();
      //   break;
      case Steps.registerRepeatPassword:
        // name["password2?"].current?.focus();
        break;

      default:
        break;
    }
  }, [step]);

  const onSubmit = async (e) => {
    setIsLoading(true);
    switch (step) {
      case Steps.login:
        await auth.signIn({ email: e.email, password: e.password });
        setIsLoading(false);
        break;
      case Steps.register:
        setStep(Steps.registerRepeatPassword);
        setIsLoading(false);
        break;
      case Steps.registerRepeatPassword:
        await auth.signUp({ email: e.email, password: e.password });
        setIsLoading(false);
        break;
      default:
        break;
    }
  };

  const handleChangeStep = (nextStep: Steps[]) => () => {
    if (nextStep.includes(Steps.registerRepeatPassword)) {
      setStep(Steps.registerRepeatPassword);
    }
  };

  return (
    <Center>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex mb="12" top="4" justifyContent="flex-start" position="relative">
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
            flex="0 1 auto"
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
          {/* {fields.map((field) => */}
          {/* field.showFor.includes(step) ? ( */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              bg="gray.50"
              type="email"
              // onFocus={handleChangeStep(field.currentStep)}
              {...register('email', {
                required: 'true',
              })}
              isInvalid={errors.name}
              id="email"
              placeholder="Email"
              pr="12"
              // ref={(e) => {
              //   register['email'].ref(e);
              //   // refs['email'].current = e;
              // }}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
            <InputGroup mt="4" size="md">
              <Input
                name="password"
                bg="gray.50"
                // onFocus={handleChangeStep(field.currentStep)}
                placeholder="Password"
                pr="12"
                type={show ? 'text' : 'password'}
                {...register('password', {
                  required: true,
                  minLength:
                    step !== Steps.login
                      ? {
                          value: 7,
                          message: 'Passwords must be at least 7 characters',
                        }
                      : null,
                  pattern:
                    step !== Steps.login
                      ? {
                          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
                          message:
                            'Passwords must contain at least one letter and one number',
                        }
                      : null,
                })}
                isInvalid={errors.message}
                id="password"
                // ref={(e) => {
                //   register['password'].ref(e);
                //   // refs['email'].current = e;
                // }}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
            {step === Steps.register ? (
              <InputGroup mt="4" size="md">
                <Input
                  name="password2"
                  bg="gray.50"
                  // onFocus={handleCha ngeStep(field.currentStep)}
                  {...register('password2', {
                    required: step === Steps.register,
                    validate: (value) =>
                      [Steps.registerRepeatPassword, Steps.register].includes(
                        step,
                      )
                        ? value === password.current ||
                          'The passwords do not match'
                        : null,
                  })}
                  isInvalid={errors.message}
                  id="password2"
                  // ref={(e) => {
                  //   register['password2'].ref(e);
                  //   // refs['email'].current = e;
                  // }}
                  placeholder="Repeat Password"
                  pr="12"
                  type={show ? 'text' : 'password'}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                {/* {field.showSubmitButtonFor.includes(step) ? ( */}
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
                {/* ) : null} */}
              </InputGroup>
            ) : null}
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          {/* ) : null,
          )} */}
        </Box>
        {step === Steps.register ? (
          <CheckBox fontWeight="Inter" color="gray.600" mt="2" w="xs">
            'I would like to receive your newsletter and other promotional
            information.'
          </CheckBox>
        ) : null}

        <Flex top="90" position="relative" flexDir="column">
          <Button
            type="submit"
            w="full"
            color="white"
            variant="ghost"
            aria-label="submit"
            isLoading={isLoading}
            spinner={<Spinner size="lg" />}
          >
            {step === Steps.register ? 'Sign Up' : `Login`}
          </Button>
          <Link
            mt="5"
            href=" "
            color="brand"
            alignContent="center"
            alignSelf="center"
            justifyItems="center"
          >
            Forgot your password?
          </Link>
        </Flex>
      </form>
    </Center>
  );
}
