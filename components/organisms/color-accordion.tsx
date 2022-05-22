import { useState } from 'react';
import { Box } from '@components/atoms/box';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@components/molecules/accordion';
import { Flex } from '@components/atoms/flex';
import { IconButton } from '@components/atoms/button';
import { HStack } from '@components/atoms/stack';
import { SketchPicker } from 'react-color';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from './modal';
import { useDisclosure } from '@hooks/use-disclosure';
import { UpdateClub } from '@lib/db';
import { useToast } from '@hooks/use-toast';
import { Input } from '@components/atoms/input';

export function ColorAccordion({ club }) {
  const toast = useToast();

  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');

  const handleColorSelect = async (e) => {
    try {
      await UpdateClub(club.id, {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    }
  };

  return (
    <>
      <Flex>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="center">
                Club Colors
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <HStack>
              <AccordionPanel pb={4}>
                Primary Color
                <form onSubmit={handleColorSelect}>
                  <Input
                    type="color"
                    color={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </form>
              </AccordionPanel>
              <AccordionPanel pb={4}>
                Secondary Color
                <form onSubmit={handleColorSelect}>
                  <Input
                    type="color"
                    color={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                </form>
              </AccordionPanel>
            </HStack>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
}
