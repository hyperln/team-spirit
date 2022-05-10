import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@components/atoms/box';
import { Button, IconButton } from '@components/atoms/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@components/molecules/form';
import { Icon } from '@components/atoms/icon';
import { Input, InputGroup, InputRightElement } from '@components/atoms/input';
import { Center } from '@components/atoms/center';
import { Text } from '@components/atoms/typography/text';
import { FadeInOut } from '@components/atoms/animations/fade';
import { useAuth } from '@hooks/use-auth';

import { useForm } from '@hooks/use-form';

enum Steps {
  login = 'login',
  register = 'register',
  registerRepeatPassword = 'registerRepeatPassword',
}

const instructions = {
  [Steps.login]: 'Enter email and password to login',
  [Steps.register]: 'Enter email and password to register',
  [Steps.registerRepeatPassword]: 'Enter password again',
};

enum Fields {
  email = 'email',
  password = 'password',
  password2 = 'password2',
}

const fieldNames = Object.keys(Fields).map((key) => key);

type Refs = {
  [Fields.email]?: { current: any; [key: string]: any };
  [Fields.password]?: { current: any; [key: string]: any };
  [Fields.password2]?: { current: any; [key: string]: any };
};

const fields = [
  {
    name: Fields.email,
    showFor: Object.keys(Steps).map((key) => key),
    currentStep: [Steps.register],
    showSubmitButtonFor: [],
    placeholder: 'Email',
    inputType: 'email',
  },
  {
    name: Fields.password,
    showFor: Object.keys(Steps).map((key) => key),
    currentStep: [Steps.register, Steps.login],
    showSubmitButtonFor: [Steps.login],
    placeholder: 'Password',
    inputType: 'password',
  },
  {
    name: Fields.password2,
    showFor: [Steps.register, Steps.registerRepeatPassword],
    currentStep: [Steps.registerRepeatPassword],
    showSubmitButtonFor: [Steps.registerRepeatPassword, Steps.register],
    placeholder: 'Repeat Password',
    inputType: 'password',
  },
];

export function AuthScreen() {
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

  const refs: Refs = fieldNames.reduce((acc, curr) => {
    const ref = useRef();
    return {
      ...acc,
      [curr]: ref,
    };
  }, {});

  const formRefs = {
    [Fields.email]: register('email', {
      required: true,
    }),
    [Fields.password]: register('password', {
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
    }),
    [Fields.password2]: register('password2', {
      required: step === Steps.registerRepeatPassword,
      validate: (value) =>
        [Steps.registerRepeatPassword, Steps.register].includes(step)
          ? value === password.current || 'The passwords do not match'
          : null,
    }),
  };

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
        refs.password2.current?.focus();
        break;

      default:
        break;
    }
  }, [step]);

  const onSubmit = async (e) => {
    switch (step) {
      case Steps.login:
        await auth.signIn({ email: e.email, password: e.password });
        break;
      case Steps.register:
        setStep(Steps.registerRepeatPassword);
        break;
      case Steps.registerRepeatPassword:
        await auth.signUp({ email: e.email, password: e.password });
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
        <Text>{instructions[step]}</Text>
        <Box w="xs" d="flex" flexDirection="column" gridGap="3">
          <AnimatePresence>
            {fields.map((field) =>
              field.showFor.includes(step) ? (
                <FadeInOut key={field.name}>
                  <FormControl isInvalid={errors[field.name]}>
                    <FormLabel htmlFor={field.name} hidden>
                      Email
                    </FormLabel>
                    <InputGroup size="md">
                      <Input
                        onFocus={handleChangeStep(field.currentStep)}
                        {...formRefs[field.name]}
                        isInvalid={errors[field.name]}
                        id={field.name}
                        ref={(e) => {
                          formRefs[field.name].ref(e);
                          refs[field.name].current = e;
                        }}
                        placeholder={field.placeholder}
                        type={field.inputType}
                        pr="12"
                      />
                      {field.showSubmitButtonFor.includes(step) ? (
                        <InputRightElement w="12">
                          <IconButton
                            type="submit"
                            w="12"
                            variant="ghost"
                            aria-label="submit"
                            icon={<Icon width="25px" src="/icons/next.svg" />}
                          />
                        </InputRightElement>
                      ) : null}
                    </InputGroup>
                    <FormErrorMessage>
                      {errors[field.name]?.message}
                    </FormErrorMessage>
                  </FormControl>
                </FadeInOut>
              ) : null,
            )}
            <Button
              color="white"
              variant="ghost"
              onClick={() =>
                setStep((prevStep) =>
                  prevStep === Steps.login ? Steps.register : Steps.login,
                )
              }
            >
              {step === Steps.register
                ? 'Already have an account? Login instead'
                : `Don't have an account? Sign up for free`}
            </Button>
          </AnimatePresence>
        </Box>
      </form>
    </Center>
  );
}
