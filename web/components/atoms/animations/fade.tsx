import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { ReactElement } from 'react';

const Wrapper = styled(motion.div)``;

export function FadeInOut({
  children,
}: {
  children: ReactElement | ReactElement[] | string;
}) {
  return (
    <Wrapper
      animate="center"
      variants={{
        enter: {
          opacity: 0,
          y: -5,
        },
        center: {
          opacity: 1,
          y: 0,
        },
        exit: {
          opacity: 0,
          y: -5,
        },
      }}
      transition={{
        opacity: { duration: 0.3 },
      }}
      exit="exit"
      initial="enter"
    >
      {children}
    </Wrapper>
  );
}
