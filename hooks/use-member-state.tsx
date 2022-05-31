import { useEffect, useReducer } from 'react';
import {
  isUserAdmin,
  isUserMember,
  isUserTeamAdmin,
  isUserTeamMember,
} from '@lib/db';
import { useToast } from './use-toast';

export type MemberState = 'member' | 'admin' | 'notMember';

interface State {
  loadingState: 'pending' | 'success' | 'error' | 'ready';
  memberState: MemberState;
}

const actions = {
  setLoadingState: (state: State, payload: string) => ({
    ...state,
    loadingState: payload,
  }),
  setMemberState: (state: State, payload: string) => ({
    ...state,
    memberState: payload,
    loadingState: 'success',
  }),
};

const initialState: State = {
  loadingState: 'ready',
  memberState: 'notMember',
};

function reducer(state: State, action: { type: string; payload: string }) {
  return actions[action.type] || state;
}

interface HookReturnValue {
  memberState: MemberState;
  isLoading: boolean;
  checkMemberState: () => void;
}

type UserMemberStateProps =
  | {
      teamId?: never;
      clubId: number;
    }
  | {
      teamId: number;
      clubId?: never;
    };

export function userMemberState({
  clubId,
  teamId,
}: UserMemberStateProps): HookReturnValue {
  const toast = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkClubMemberState = async () => {
    const [isMember, isAdmin] = await Promise.all([
      isUserMember(clubId),
      isUserAdmin(clubId),
    ]);
    dispatch({
      type: 'setMemberState',
      payload: isAdmin ? 'admin' : isMember ? 'member' : 'notMember',
    });
  };

  const checkTeamMemberState = async () => {
    const [isMember, isAdmin] = await Promise.all([
      isUserTeamMember(teamId),
      isUserTeamAdmin(teamId),
    ]);
    dispatch({
      type: 'setMemberState',
      payload: isAdmin ? 'admin' : isMember ? 'member' : 'notMember',
    });
  };

  const checkMemberState = async () => {
    try {
      dispatch({
        type: 'setLoadingState',
        payload: 'pending',
      });
      if (clubId) checkClubMemberState();
      else if (teamId) checkTeamMemberState();
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
    memberState: state.isAdmin
      ? 'admin'
      : state.isMember
      ? 'member'
      : 'notMember',
    isLoading: state.loadingState === 'pending',
    checkMemberState,
  };
}
