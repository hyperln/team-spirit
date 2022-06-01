import { ArrowRightIcon } from '@chakra-ui/icons';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { HStack } from '@components/atoms/stack';
import { Heading } from '@components/atoms/typography/heading';
import { FormControl, FormLabel } from '@components/molecules/form';
import { PageHeader } from '@components/organisms/pageheader';
import { withContext } from '@hoc/with-context';
import { useProfile } from '@hooks/use-profile';
import { api } from '@lib/api/client';
import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';

interface State {
  step: 'address' | 'payment';
  loadingState: 'idle' | 'loading' | 'success' | 'error';
}
interface Action {
  type: string;
  payload: any;
}

interface Actions {
  setStep: (state: State, action: Action) => State;
  setLoadingState: (state: State, action: Action) => State;
}

const initialState: State = {
  step: 'address',
  loadingState: 'idle',
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
};

function reducer(state: State, action: Action) {
  return actions[action.type](state, action) || state;
}

const FormContext = createContext(null);

function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

function AddressForm() {
  const { state, dispatch } = useContext(FormContext);
  const user = useProfile();

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

      console.log('values :>> ', values);
      console.log('user :>> ', user);
      // const data = await api('/customers').post(values);
      // console.log('data :>> ', data);
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
            <FormLabel htmlFor="postcode">Post Code</FormLabel>
            <Input required id="postcode" type="text" />
          </span>
          <span>
            <FormLabel htmlFor="state">State</FormLabel>
            <Input required id="state" type="text" />
          </span>
        </HStack>
      </FormControl>
      <Button
        color="white"
        variant="ghost"
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

export const AddPaymentMethodTemplate = withContext(
  function AddPaymentMethodTemplate() {
    const { state } = useContext(FormContext);
    return (
      <Box>
        <PageHeader title="Add Payment Method" backgroundColor="white" />
        {/* <Heading textAlign="center" size="md">
          Add payment method
        </Heading> */}
        <Box mx="8" my="4">
          {state.step === 'address' ? <AddressForm /> : null}
        </Box>
      </Box>
    );
  },
  FormProvider,
);
