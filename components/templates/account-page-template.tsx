import { Box } from '@components/atoms/box';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { Text } from '@components/atoms/typography/text';
import { useAuth } from '@hooks/use-auth';
import { currentUser } from '@lib/auth';
import { client } from '@lib/auth/client';
import { useEffect, useState } from 'react';


export function AccountPageTemplate() {

  const { user } = useAuth()
  const [ image, setImage ] = useState(null) 
  const [ firstname, setFirstname] = useState("")
  const [ lastname, setLastname] = useState("")
  const [ avatarurl, setAvatarUrl] = useState("")
  const [ message, setMessage] = useState("")
  
  const handleSubmit = async(e) => {
    e.preventDefault()

    let avatarUrl = ""
    if(image) {
      const {data, error} = await client.storage.from("avatars").upload(`${Date.now()}_${image.name}`, image)
      
      if(error) {
        console.log(error)
      }

      if(data) {
        setAvatarUrl(data.Key)
        avatarUrl = data.Key
      }
    }

    const {data, error} = await client.from("profiles").upsert( {
      id: user.id,
      first_name: firstname,
      last_name: lastname,
      avatar_url: avatarurl
      })

      if(error) {
        console.log(error)
      }
      if(data) {
        setMessage("Profile has been updated!")
      }
  }


  return (
    <Box>
      {message && message}
      Welcome, {user?.email}
      <Input 
      type="text" 
      placeholder="First Name" 
      onChange={e => setFirstname(e.target.value)} 
      value={firstname} />
      <Input 
      type="text" 
      placeholder="Last Name" 
      onChange={e => setLastname(e.target.value)} 
      value={lastname}/>
      <Input 
      type="file" 
      placeholder="profile pic" 
      accept={"image/jpeg image/png"} 
      onChange={e => setImage(e.target.files)} />
      <Button onClick={handleSubmit} >
      Save Profile
      </Button>
    </Box>
  );
}
