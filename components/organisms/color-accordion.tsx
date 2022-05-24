import { useEffect, useState } from 'react';
import { Box } from '@components/atoms/box';
import { HexColorPicker } from 'react-color';
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
import { Club } from 'shared/types';

interface Props {
  club: Club;
}

export function ColorAccordion({ club }: Props) {
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
        primaryColor,
        secondaryColor,
      });
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'error',
      });
    } finally {
      setIsLoading(false);
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
            <form onSubmit={handleColorSelect}>
              <HStack>
                <AccordionPanel textAlign="center">
                  Primary
                  <Input
                    borderRadius="full"
                    outline="none"
                    w="16"
                    type="color"
                    defaultValue={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                  />
                </AccordionPanel>
              </HStack>
              <HStack>
                <AccordionPanel
                  justifyContent="center"
                  textAlign="center"
                  onSubmit={handleColorSelect}
                >
                  Secondary
                  <Input
                    w="16"
                    type="color"
                    defaultValue={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                  />
                </AccordionPanel>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  spinner={<Spinner size="lg" />}
                >
                  Save
                </Button>
              </HStack>
            </form>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
}
