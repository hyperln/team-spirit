import { useState } from 'react';
import { Box } from '@components/atoms/box';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@components/molecules/accordion';
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
  const [primaryColor, setPrimaryColor] = useState(club.primaryColor || '');
  const [secondaryColor, setSecondaryColor] = useState(
    club.secondaryColor || '',
  );

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
      <Accordion reduceMotion mt="2" allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box textAlign="left" flex="1">
              Club Colors
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <form onSubmit={handleColorSelect}>
            <Box alignItems="center" justifyContent="space-between">
              <AccordionPanel>
                Primary
                <Input
                  border="none"
                  p="0"
                  ml="64"
                  w="10"
                  type="color"
                  defaultValue={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </AccordionPanel>
              <AccordionPanel>
                Secondary
                <Input
                  border="none"
                  p="0"
                  ml="60"
                  w="10"
                  type="color"
                  defaultValue={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </AccordionPanel>
              <AccordionPanel justifyContent="center" textAlign="center">
                <Button
                  color="white"
                  variant="ghost"
                  isLoading={isLoading}
                  type="submit"
                  spinner={<Spinner size="lg" />}
                >
                  Save
                </Button>
              </AccordionPanel>
            </Box>
          </form>
        </AccordionItem>
      </Accordion>
    </>
  );
}
