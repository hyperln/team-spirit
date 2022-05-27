import { PasswordRecoveryTemplate } from '@components/templates/password-recovery-template';
import { useToast } from '@hooks/use-toast';
import { keysToCamel } from '@utils/object-utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function PassworRecoveryPage(props) {
  const toast = useToast();
  const router = useRouter();
  const [resetData, setResetData] = useState({
    type: '',
    accessToken: '',
    refreshToken: '',
  });

  useEffect(() => {
    const hash = window.location.hash?.split('#')[1];
    if (hash) {
      const parts = keysToCamel(
        hash.split('&').reduce((acc, item) => {
          const [key, value] = item.split('=');
          acc[key] = value;
          return acc;
        }, {}),
      );
      if (parts?.errorCode === '404') {
        toast({
          status: 'error',
          title: 'Error',
          description: parts?.errorDescription.replaceAll('+', ' '),
        });
        router.push('/login');
      } else if (parts?.errorCode) {
        toast({
          status: 'error',
          title: 'Error',
          description: parts?.errorDescription
            ? parts.errorDescription.replaceAll('+', ' ')
            : 'Invalid token',
        });
        router.push('/login');
      }
      if (parts?.type === 'recovery') setResetData(parts);
    }
  }, []);

  return resetData.type === 'recovery' ? (
    <PasswordRecoveryTemplate accessToken={resetData.accessToken} />
  ) : null;
}
