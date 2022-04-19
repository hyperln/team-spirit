import {
  useColorMode as chakraUseColorMode,
  useColorModeValue as chakraUseColorModeValue,
} from '@chakra-ui/react';

export function useColorMode() {
  return chakraUseColorMode();
}

export const useColorModeValue = chakraUseColorModeValue;
