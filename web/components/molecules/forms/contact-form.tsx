import { FormEvent, useReducer } from 'react';
import { Input } from '@components/atoms/input/input';
import { Button } from '@components/atoms/button/button';
import { Textarea } from '@components/atoms/textarea/textarea';

export type ContactFormSubmitValue = {
  name: string;
  email: string;
  message: string;
};

type Props = {
  onSubmit: (data: ContactFormSubmitValue) => void;
};

export enum Actions {
  setName = 'setName',
  setEmail = 'setEmail',
  setMessage = 'setMessage',
}

type Payload = string;

type Action =
  | { type: Actions.setName; payload: Payload }
  | { type: Actions.setMessage; payload: Payload }
  | { type: Actions.setEmail; payload: Payload };

type ActionFunction = (
  state: ContactFormSubmitValue,
  payload: Payload,
) => ContactFormSubmitValue;

const initialState = {
  name: '',
  email: '',
  message: '',
};

const actions: Record<Actions, ActionFunction> = {
  setName: (state: ContactFormSubmitValue, payload: Payload) => ({
    ...state,
    name: payload,
  }),
  setEmail: (state: ContactFormSubmitValue, payload: Payload) => ({
    ...state,
    email: payload,
  }),
  setMessage: (state: ContactFormSubmitValue, payload: Payload) => ({
    ...state,
    message: payload,
  }),
};

function reducer(
  state: ContactFormSubmitValue,
  action: Action,
): ContactFormSubmitValue {
  return actions[action.type](state, action.payload) || state;
}

export function ContactForm({ onSubmit }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(state);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={state.name}
        onChange={(e) =>
          dispatch({ type: Actions.setName, payload: e.target.value })
        }
        required
        type="text"
        name="Name"
      />
      <Input
        value={state.email}
        onChange={(e) =>
          dispatch({ type: Actions.setEmail, payload: e.target.value })
        }
        required
        type="email"
        name="Email"
      />
      <Textarea
        value={state.message}
        onChange={(e) =>
          dispatch({ type: Actions.setMessage, payload: e.target.value })
        }
        required
        name="Message"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
