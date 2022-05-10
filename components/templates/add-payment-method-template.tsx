import { ArrowRightIcon } from '@chakra-ui/icons';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Input } from '@components/atoms/input';
import { Select } from '@components/atoms/select';
import { HStack } from '@components/atoms/stack';
import { Heading } from '@components/atoms/typography/heading';
import { FormControl, FormLabel } from '@components/molecules/form';
import { Skeleton } from '@components/molecules/skeleton';
import { ClickableStepper } from '@components/organisms/clickable-stepper';
import { withContext } from '@hoc/with-context';
import { useProfile } from '@hooks/use-profile';
import { api } from '@lib/api/client';
import { fetchCountryList, updateUserProfile } from '@lib/db';
import { PaymentElement } from '@lib/payments/components';
import { PaymentsContext } from '@lib/payments/context';
import { Address } from '@lib/payments/payment-types';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { capitalizeFirstLetter } from '@utils/string-utils';
import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { config } from 'config';

enum Steps {
  'address',
  'payment',
}

interface State {
  step: Steps;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  customerId: string;
  setupIntent: any;
  billingAddress: Address;
  countries: any[];
}
interface Action {
  type: string;
  payload: any;
}

interface Actions {
  setStep: (state: State, action: Action) => State;
  setLoadingState: (state: State, action: Action) => State;
  setCustomerId: (state: State, action: Action) => State;
  setSetupIntent: (state: State, action: Action) => State;
  setCountries: (state: State, action: Action) => State;
}

const initialState: State = {
  step: Steps.address,
  loadingState: 'loading',
  customerId: null,
  setupIntent: null,
  billingAddress: null,
  countries: null,
};

const actions: Actions = {
  setStep: (state, action) => ({
    ...state,
    step: action.payload,
  }),
  setLoadingState: (state, action) => ({
    ...state,
    loadingState: action.payload,
  }),
  setCustomerId: (state, action) => ({
    ...state,
    customerId: action.payload,
  }),
  setSetupIntent: (state, action) => ({
    ...state,
    setupIntent: action.payload,
  }),
  setCountries: (state, action) => ({
    ...state,
    countries: action.payload,
  }),
};

function reducer(state: State, action: Action) {
  return actions[action.type](state, action) || state;
}

const FormContext = createContext(null);

function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile } = useProfile();

  const fetchCustomer = async () => {
    try {
      const customerData = await api(
        `/customers?email=${encodeURIComponent(profile.email)}`,
      ).get();
      if (customerData) {
        dispatch({ type: 'setCustomerId', payload: customerData.id });
        dispatch({ type: 'setStep', payload: 'payment' });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        dispatch({ type: 'setStep', payload: 'address' });
      }
    }
  };

  const init = async () => {
    dispatch({ type: 'setLoadingState', payload: 'loading' });
    const [countries] = await Promise.all([
      fetchCountryList(),
      fetchCustomer(),
    ]);
    dispatch({ type: 'setCountries', payload: countries });
    dispatch({ type: 'setLoadingState', payload: 'success' });
  };

  const createSetupIntent = async () => {
    dispatch({ type: 'setLoadingState', payload: 'loading' });
    const data = await api('/intents').post({
      userId: profile.id,
      customer: state.customerId,
    });
    if (data) {
      dispatch({ type: 'setLoadingState', payload: 'success' });
      dispatch({ type: 'setSetupIntent', payload: data });
    }
  };

  useEffect(() => {
    if (profile) {
      init();
    }
  }, [profile]);

  useEffect(() => {
    if (state.customerId && !state.setupIntent) {
      createSetupIntent();
    }
  }, [state.customerId, state.setupIntent]);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

function AddressForm() {
  const { state, dispatch } = useContext(FormContext);
  const { profile } = useProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: 'setLoadingState', payload: 'loading' });
      const { ...inputs } = e.target;
      const values = Object.entries(inputs)
        .map(([, value]) =>
          value.value
            ? {
                value: value.value,
                name: value.id,
              }
            : false,
        )
        .filter(Boolean);
      const createCustomerData = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        address: values.reduce((acc, { name, value }: any) => {
          acc[name] = value;
          return acc;
        }, {}),
      };
      const data = await api('/customers').post(createCustomerData);
      updateUserProfile(profile.id, { customerId: data.id });
      dispatch({ type: 'setCustomerId', payload: data.id });
      dispatch({ type: 'setStep', payload: 'payment' });
      dispatch({ type: 'setLoadingState', payload: 'success' });
    } catch (error) {
      dispatch({ type: 'setLoadingState', payload: 'error' });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <FormControl my="4">
        <FormLabel htmlFor="address1">Address</FormLabel>
        <Input required id="address1" type="text" />
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <Input id="address2" type="text" />
        <FormLabel htmlFor="city">City</FormLabel>
        <Input required id="city" type="text" />
        <FormLabel htmlFor="country">Country</FormLabel>
        <Select defaultValue="AU" required id="country">
          {state.countries &&
            state.countries.map((country: any) => (
              <option key={country.iso2} value={country.iso2}>
                {country.name}
              </option>
            ))}
        </Select>
        <HStack>
          <span>
            <FormLabel htmlFor="postalCode">Post Code</FormLabel>
            <Input required id="postalCode" type="text" />
          </span>
          <span>
            <FormLabel htmlFor="stateOrProvince">State</FormLabel>
            <Input required id="stateOrProvince" type="text" />
          </span>
        </HStack>
      </FormControl>
      <Button
        colorScheme="orange"
        rounded="full"
        isLoading={state.loadingState === 'loading'}
        w="full"
        type="submit"
        rightIcon={<ArrowRightIcon />}
      >
        Save billing address
      </Button>
    </form>
  );
}

function PaymentForm() {
  const { state, dispatch } = useContext(FormContext);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${config.site.url}/account/payment-methods/success`,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box my="10">
        <PaymentElement />
      </Box>
      <Button
        disabled={!stripe}
        colorScheme="orange"
        rounded="full"
        isLoading={state.loadingState === 'loading'}
        w="full"
        type="submit"
      >
        Save payment details
      </Button>
    </form>
  );
}

function AddPaymentDetailsContext() {
  const { state, dispatch } = useContext(FormContext);

  const options = useMemo(() => {
    return {
      clientSecret: state.setupIntent?.client_secret,
    };
  }, [state.setupIntent?.client_secret]);

  return !state.setupIntent?.client_secret ? (
    <Skeleton h="48" />
  ) : (
    <PaymentsContext options={options}>
      <PaymentForm />
    </PaymentsContext>
  );
}

interface Step {
  label: string;
}

const steps: Step[] = Object.values(Steps)
  .map((step) =>
    typeof step === 'string'
      ? {
          label: capitalizeFirstLetter(step),
        }
      : false,
  )
  .filter(Boolean) as unknown as Step[];

export const AddPaymentMethodTemplate = withContext(
  function AddPaymentMethodTemplate() {
    const { state, dispatch } = useContext(FormContext);
    const handleStepClick = (step: number) => {
      dispatch({ type: 'setStep', payload: Steps[step] });
    };

    const activeIndex = useMemo(() => {
      return steps.findIndex((step) => step.label.toLowerCase() === state.step);
    }, [state.step]);

    return (
      <Flex flexDirection="column">
        <Heading textAlign="center" size="md">
          Add {state.step === 'address' ? 'billing address' : 'payment method'}
        </Heading>
        <Box mx="8" my="4">
          <Skeleton isLoaded={state.loadingState !== 'loading'}>
            <Box mb="8" mx={{ base: '10', lg: '16' }}>
              <ClickableStepper
                activeIndex={activeIndex}
                onStepClick={handleStepClick}
                steps={steps}
              />
            </Box>
            {state.step === 'address' ? (
              <AddressForm />
            ) : (
              <AddPaymentDetailsContext />
            )}
          </Skeleton>
        </Box>
      </Flex>
    );
  },
  FormProvider,
);
