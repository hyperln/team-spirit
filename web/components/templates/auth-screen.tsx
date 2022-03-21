import { useEffect, useRef, useState } from 'react';
import { Box } from '@components/atoms/box';
import { IconButton } from '@components/atoms/button/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@components/atoms/form';
import { Icon } from '@components/atoms/icon/icon';
import {
  Input,
  InputGroup,
  InputRightElement,
} from '@components/atoms/input/input';
import { Center } from '@components/atoms/layout';
import { Text } from '@components/atoms/typography/text';
import { FadeInOut } from '@components/atoms/animations/fade';
import { useAuth } from '@hooks/use-auth';

import { useForm } from '@hooks/use-form';
import { AnimatePresence } from 'framer-motion';

enum Steps {
  checkEmail = 'checkEmail',
  login = 'login',
  register = 'register',
  registerRepeatPassword = 'registerRepeatPassword',
}

const instructions = {
  [Steps.checkEmail]: 'Please enter your email address.',
  [Steps.login]: 'Enter password',
  [Steps.register]: 'Enter password',
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
    currentStep: [Steps.checkEmail],
    showSubmitButtonFor: [Steps.checkEmail],
    placeholder: 'Email',
    inputType: 'email',
  },
  {
    name: Fields.password,
    showFor: Object.keys(Steps)
      .map((key) => key)
      .filter((step) => step !== Steps.checkEmail),
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
  const [step, setStep] = useState(Steps.checkEmail);
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
      required: step !== Steps.checkEmail,
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
      case Steps.checkEmail:
        refs.email.current?.focus();
        break;
      case Steps.login:
      case Steps.register:
        refs.password.current?.focus();
        break;
      case Steps.registerRepeatPassword:
        refs.password2.current?.focus();
        break;

      default:
        break;
    }
  }, [step]);

  useEffect(() => {
    if (step === Steps.checkEmail && auth.userExists === 'registered') {
      setStep(Steps.login);
    } else if (
      step === Steps.checkEmail &&
      auth.userExists === 'unregistered'
    ) {
      setStep(Steps.register);
    }
  }, [auth.userExists]);

  const onSubmit = async (e) => {
    switch (step) {
      case Steps.checkEmail:
        auth.checkEmail(e.email);
        break;
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
    if (nextStep[0] === Steps.checkEmail) {
      setStep(nextStep[0]);
      fieldNames.forEach((field) => {
        if (field !== Fields.email) {
          setValue(field, null);
        }
      });
    }
    if (nextStep.includes(Steps.register) && nextStep.includes(Steps.login)) {
      if (auth.userExists === 'registered') {
        setStep(Steps.login);
      } else if (auth.userExists === 'unregistered') {
        setStep(Steps.register);
      }
    }
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
                            isLoading={auth.isLoading || isSubmitting}
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
          </AnimatePresence>
        </Box>
      </form>
    </Center>
  );
}
