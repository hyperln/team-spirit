import { useEffect, useState } from 'react';
import { client } from '@lib/db/client';
import { Flex } from '@components/atoms/flex';
import { Box } from '@components/atoms/box';
import { Input } from '@components/atoms/input';
import { Button } from '@components/atoms/button';
import { List, ListItem, UnorderedList } from '@components/atoms/list';

export default function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [newClub, setNewClub] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const { data: clubs } = await client
      .from('clubs')
      .select('*')
      .order('name');
    setClubs(clubs);
  };

  const addClub = async (clubName, clubEstablished) => {
    let { data: club } = await client
      .from('clubs')
      .insert({ name: clubName, established: clubEstablished })
      .single();
    setClubs([...clubs, club]);
  };

  return (
    <Flex>
      <Box>
        <Input
          type="text"
          placeholder="Club Name"
          value={newClub}
          onChange={(e) => {
            setNewClub(e.target.value);
          }}
        />
        <Button onClick={() => addClub(newClub)}>Add Club</Button>
      </Box>
      <UnorderedList>
        {clubs.map((club) => (
          <ListItem key={club.id}>{club.name}</ListItem>
        ))}
      </UnorderedList>
    </Flex>
  );
}

// import { Box } from '@components/atoms/box';
// import { Button } from '@components/atoms/button';
// import { Flex } from '@components/atoms/flex';
// import { Input } from '@components/atoms/input';
// import { Spinner } from '@components/atoms/spinner';
// import { useAuth } from '@hooks/use-auth';
// import { useProfile } from '@hooks/use-profile';
// import { useToast } from '@hooks/use-toast';
// import { createClub, listClubs } from '@lib/db';

// export function RegisterClubTemplate() {
//   const toast = useToast();
//   const { user } = useAuth();
//   const { profile, fetchProfile } = useProfile();

//   const [clubName, setClubName] = useState('');
//   const [clubEstablished, setClubEstablished] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (profile) {
//       setClubName(profile.clubName);
//       setClubEstablished(profile.clubEstablished);
//     }
//   }, [profile]);

//   const handleSubmit = async (e) => {
//     setIsLoading(true);
//     e.preventDefault();

//     try {
//       await createClub(user.id, {
//         clubName,
//         clubEstablished,
//       });
//       toast({
//         status: 'success',
//         description: 'Club has been Registered!',
//         title: 'Success',
//       });
//     } catch (error) {
//       toast({
//         status: 'error',
//         description: error.message,
//         title: 'error',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Flex justifyContent="center">
//       <form onSubmit={handleSubmit}>
//         <Input
//           type="text"
//           placeholder="Club Name"
//           onChange={(e) => setClubName(e.target.value)}
//           value={clubName}
//           name="clubName"
//         />

//         <Input
//           type="text"
//           placeholder="Established "
//           onChange={(e) => setClubEstablished(e.target.value)}
//           value={clubEstablished}
//           name="clubEstablished"
//         />

//         <Button
//           type="submit"
//           isLoading={isLoading}
//           spinner={
//             <Spinner
//               color="brand.50"
//               variant="outline"
//               thickness="3.8px"
//               emptyColor="gray.600"
//               speed="0.75s"
//               size="lg"
//             />
//           }
//         >
//           Register Club
//         </Button>
//       </form>
//     </Flex>
//   );
// }
