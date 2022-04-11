import { Button } from '@components/atoms/button';
import { Flex } from '@components/atoms/flex';
import { Input } from '@components/atoms/input';
import { Select } from '@components/atoms/select';
import { Spinner } from '@components/atoms/spinner';
import { FormControl, FormLabel } from '@components/molecules/form';
import { useAuth } from '@hooks/use-auth';
import { createClub } from '@lib/db';
import { client } from '@lib/db/client';
import { useEffect, useState } from 'react';

export function RegisterClubTemplate() {
  const { user, club } = useAuth();

  const [clubName, setClubName] = useState('');
  const [clubCity, setClubCity] = useState('');
  const [clubCountry, setClubCountry] = useState('');
  const [clubState, setClubState] = useState('');
  const [clubEstablished, setClubEstablished] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (club) {
      setClubName(club.clubName);
      setClubCity(club.clubCity);
      setClubCountry(club.clubCountry);
      setClubState(club.clubState);
      setClubEstablished(club.clubEstablished);
    }
  }, [club]);

  const handleCountrySelect = (e) => {
    setClubCountry(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // try {
    //   await createClub(club.id, {
    //     clubName,
    //     clubCity,
    //     clubCountry,
    //     clubState,
    //     clubEstablished,
    //   });
  };

  return (
    <Flex justifyContent="center">
      <FormControl onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Club Name"
          onChange={(e) => setClubName(e.target.value)}
          value={clubName}
          name="clubName"
        />
        <Input
          type="text"
          placeholder="Club City"
          onChange={(e) => setClubCity(e.target.value)}
          value={clubCity}
          name="clubCity"
        />
        <FormLabel htmlFor="country">Country</FormLabel>
        <Select
          id="country"
          placeholder="Select country"
          onChange={handleCountrySelect}
          value={clubCountry}
        >
          <option value="australia">Australia</option>
          <option value="sweden">Sweden</option>
        </Select>

        <FormLabel htmlFor="state">State</FormLabel>
        <Select id="state" placeholder="Select state">
          <option>New South Wales</option>
          <option>Northern Territory</option>
          <option>Victoria</option>
          <option>Western Australia</option>
          <option>Queensland</option>
          onChange={(e) => setClubState(e.target.value)}
          value={clubState}
          name='clubState'
        </Select>

        <Input
          type="year"
          placeholder="Established "
          onChange={(e) => setClubEstablished(e.target.value)}
          value={clubEstablished}
          name="clubEstablished"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          spinner={
            <Spinner
              color="brand.50"
              variant="outline"
              thickness="3.8px"
              emptyColor="gray.600"
              speed="0.75s"
              size="lg"
            />
          }
        >
          Create Club
        </Button>
      </FormControl>
    </Flex>
  );
}
