import { ArrowRightIcon } from '@chakra-ui/icons';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { HStack } from '@components/atoms/stack';
import { Heading } from '@components/atoms/typography/heading';
import { FormControl, FormLabel } from '@components/molecules/form';
import { Skeleton } from '@components/molecules/skeleton';
import { ClickableStepper } from '@components/organisms/clickable-stepper';
import { withContext } from '@hoc/with-context';
import { useProfile } from '@hooks/use-profile';
import { api } from '@lib/api/client';
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

enum Steps {
  'address',
  'payment',
}

interface State {
  step: Steps;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
  customerId: string;
}
interface Action {
  type: string;
  payload: any;
}

interface Actions {
  setStep: (state: State, action: Action) => State;
  setLoadingState: (state: State, action: Action) => State;
  setCustomerId: (state: State, action: Action) => State;
}

const initialState: State = {
  step: Steps.address,
  loadingState: 'loading',
  customerId: null,
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
};

function reducer(state: State, action: Action) {
  return actions[action.type](state, action) || state;
}

const FormContext = createContext(null);

function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile } = useProfile();
  const fetchCustomer = async () => {
    dispatch({ type: 'setLoadingState', payload: 'loading' });
    const data = await api(
      `/customers?email=${encodeURIComponent(profile.email)}`,
    ).get();
    if (data) {
      dispatch({ type: 'setCustomerId', payload: data.id });
      dispatch({ type: 'setStep', payload: 'payment' });
    }
    dispatch({ type: 'setLoadingState', payload: 'success' });
  };
  useEffect(() => {
    if (profile) {
      fetchCustomer();
    }
  }, [profile]);
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
      dispatch({ type: 'setCustomerId', payload: data.id });
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
        <Input required id="country" type="text" />
        <HStack>
          <span>
            <FormLabel htmlFor="postalCode">Post Code</FormLabel>
            <Input required id="postalCode" type="text" />
          </span>
          <span>
            <FormLabel htmlFor="state">State</FormLabel>
            <Input required id="state" type="text" />
          </span>
        </HStack>
      </FormControl>
      <Button
        isLoading={state.loadingState === 'loading'}
        w="full"
        type="submit"
        rightIcon={<ArrowRightIcon />}
      >
        Next
      </Button>
    </form>
  );
}

function AddPaymentDetailsForm() {
  const { state, dispatch } = useContext(FormContext);
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
      <Box>
        <Heading textAlign="center" size="md">
          Add payment method
        </Heading>
        <Box mx="8" my="4">
          <Skeleton isLoaded={state.loadingState !== 'loading'}>
            <ClickableStepper
              activeIndex={activeIndex}
              onStepClick={handleStepClick}
              steps={steps}
            />
            {state.step === 'address' ? <AddressForm /> : null}
          </Skeleton>
        </Box>
      </Box>
    );
  },
  FormProvider,
);
