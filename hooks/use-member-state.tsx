import { useEffect, useReducer } from 'react';
import { isUserAdmin, isUserMember } from '@lib/db';
import { useToast } from './use-toast';

export type MemberState = 'member' | 'admin' | 'notMember';

interface State {
  loadingState: 'pending' | 'success' | 'error' | 'ready';
  userState: MemberState;
}

const actions = {
  setLoadingState: (state: State, payload: string) => ({
    ...state,
    loadingState: payload,
  }),
  setMemberState: (state: State, payload: string) => ({
    ...state,
    userState: payload,
    loadingState: 'success',
  }),
};

const initialState: State = {
  loadingState: 'ready',
  userState: 'notMember',
};

function reducer(state: State, action: { type: string; payload: string }) {
  return actions[action.type] || state;
}

interface HookReturnValue {
  userState: MemberState;
  isLoading: boolean;
  checkMemberState: () => void;
}

export function userMemberState(clubId: number): HookReturnValue {
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkMemberState = async () => {
    try {
      dispatch({
        type: 'setLoadingState',
        payload: 'pending',
      });
      const [isMember, isAdmin] = await Promise.all([
        isUserMember(clubId),
        isUserAdmin(clubId),
      ]);
      dispatch({
        type: 'setMemberState',
        payload: isAdmin ? 'admin' : isMember ? 'member' : 'notMember',
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
      dispatch({
        type: 'setLoadingState',
        payload: 'error',
      });
    }
  };

  useEffect(() => {
    checkMemberState();
  }, []);

  return {
    userState: state.isAdmin
      ? 'admin'
      : state.isMember
      ? 'member'
      : 'notMember',
    isLoading: state.loadingState === 'pending',
    checkMemberState,
  };
}
