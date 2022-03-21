import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { colors } from '@theme/theme';

const SlideIn = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: ${colors.brand[100]};
  transform-origin: left;
`;

const SlideOut = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: ${colors.brand[100]};
  transform-origin: right;
`;

const Wrapper = styled(motion.div)``;

const withTransition = (Component) => (props) => (
  <>
    <Wrapper
      animate="center"
      variants={{
        enter: {
          opacity: 0,
        },
        center: {
          zIndex: 1,
          opacity: 1,
        },
        exit: {
          // zIndex: 0,
          opacity: 0,
        },
      }}
      transition={{
        opacity: { duration: 0.3 },
      }}
      exit="exit"
      initial="enter"
    >
      <Component {...props} />
    </Wrapper>

    <SlideIn
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 0 }}
      exit={{ scaleX: 1 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    />
    <SlideOut
      initial={{ scaleX: 1 }}
      animate={{ scaleX: 0 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    />
  </>
);

export default withTransition;
