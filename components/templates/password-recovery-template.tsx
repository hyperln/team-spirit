import { Button } from '@components/atoms/button';
import { Center } from '@components/atoms/center';
import { Input } from '@components/atoms/input';
import { Spinner } from '@components/atoms/spinner';
import { updatePassword } from '@lib/auth';
import { useState } from 'react';

export function PasswordRecoveryTemplate({ accessToken }) {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      console.log('newPassword :>> ', newPassword);
      const data = await updatePassword(accessToken, newPassword);
      console.log('data :>> ', data);
    } catch (error) {
      console.log('error :>> ', error);
      // toast error message
    }
    setIsLoading(false);
  };

  return (
    <Center>
      <form onSubmit={handleSubmit}>
        <Input
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          type="password"
        />
        <Button
          type="submit"
          w="full"
          color="white"
          variant="ghost"
          aria-label="submit"
          isLoading={isLoading}
          spinner={<Spinner size="lg" />}
          bottom="1"
        >
          Save
        </Button>
      </form>
    </Center>
  );
}
