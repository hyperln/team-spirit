import { ReactElement } from 'react';

export enum Themes {
  dark = 'dark',
  light = 'light',
}

export type State = {
  theme: Themes;
};

export type ContextProps = {
  dispatch: React.Dispatch<Action>;
  state: State;
};

export type ProviderProps = {
  children: ReactElement | ReactElement[];
};

export enum Actions {
  setTheme = 'setTheme',
}

export type Payload = Themes | string | boolean;

export type Action = { type: Actions.setTheme; payload: Payload };

export type ActionFunction = (state: State, payload?: Payload) => State;
