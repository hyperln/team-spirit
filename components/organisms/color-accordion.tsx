import { useEffect, useState } from 'react';
import { Box } from '@components/atoms/box';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@components/molecules/accordion';
import { Flex } from '@components/atoms/flex';
import { HStack } from '@components/atoms/stack';
import { UpdateClub } from '@lib/db';
import { useToast } from '@hooks/use-toast';
import { Input } from '@components/atoms/input';
import { Button } from '@components/atoms/button';
import { Spinner } from '@components/atoms/spinner';

export function ColorAccordion({ club }) {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');

  useEffect(() => {
    setPrimaryColor(primaryColor);
    setSecondaryColor(secondaryColor);
  }, []);

  const handleColorSelect = async (e) => {
    setIsLoading(true);
    e.preventDefault();
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
              <AccordionPanel
                textAlign="center"
                onSubmit={handleColorSelect}
                pb={4}
              >
                Primary Color
                <Input
                  type="color"
                  defaultValue={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </AccordionPanel>
              <Button
                isLoading={isLoading}
                type="submit"
                spinner={<Spinner size="lg" />}
              >
                Save
              </Button>
              <AccordionPanel
                textAlign="center"
                onSubmit={handleColorSelect}
                pb={4}
              >
                Secondary Color
                <Input
                  type="color"
                  defaultValue={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </AccordionPanel>
            </HStack>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
}
