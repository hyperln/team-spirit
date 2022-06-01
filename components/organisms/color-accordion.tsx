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
import { Spacer } from '@components/atoms/spacer';
import { Text } from '@components/atoms/typography/text';

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
      <Accordion minWidth="80" mt="2" allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Text fontWeight="bold" textAlign="left" flex="1">
              Club Colors
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <form onSubmit={handleColorSelect}>
            <AccordionPanel pb="2" display="flex" alignItems="center">
              <Box color="GrayText" fontWeight="semibold">
                Primary
              </Box>
              <Spacer />
              <Box>
                <Input
                  border="none"
                  p="0"
                  boxSize="8"
                  type="color"
                  defaultValue={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </Box>
            </AccordionPanel>

            <AccordionPanel display="flex" alignItems="center">
              <Text color="GrayText" fontWeight="semibold">
                Secondary
              </Text>
              <Spacer />
              <Box width="25" height="25">
                <Input
                  border="none"
                  p="0"
                  boxSize="8"
                  type="color"
                  defaultValue={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </Box>
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
          </form>
        </AccordionItem>
      </Accordion>
    </>
  );
}
