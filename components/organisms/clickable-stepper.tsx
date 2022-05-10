import { CheckIcon } from '@chakra-ui/icons';
import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Fragment } from 'react';

function Step({ label, index, isActive, onClick, isDone }) {
  return (
    <Flex alignItems="center" flexDirection="column" position="relative">
      <Button
        onClick={() => onClick(index)}
        variant="unstyled"
        rounded="full"
        flexGrow={0}
        w="10"
        h="10"
        justifyContent="center"
        alignItems="center"
        bgColor={isActive ? 'orange.300' : 'orange.400'}
        color="white"
        fontSize="xl"
      >
        {isDone ? <CheckIcon /> : index + 1}
      </Button>
      <Box top="10" position="absolute">
        {label}
      </Box>
    </Flex>
  );
}

function Divider() {
  return <Box flexGrow={1} h="0.5" bgColor="orange.400" />;
}

interface Props {
  steps: { label: string }[];
  activeIndex?: number;
  onStepClick: (value: number) => void;
}

export function ClickableStepper({
  steps,
  onStepClick,
  activeIndex = 0,
}: Props) {
  return (
    <Flex alignItems="center" gap="1" justifyContent="space-between" w="full">
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          <Step
            isDone={index < activeIndex}
            onClick={onStepClick}
            isActive={index === activeIndex}
            index={index}
            key={step.label}
            label={step.label}
          />
          {index < steps.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Flex>
  );
}