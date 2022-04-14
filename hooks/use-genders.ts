import { fetchGenders } from '@lib/db';
import { useEffect, useState } from 'react';

export function useGenders() {
  const [genders, setGenders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initGenders = async () => {
    const data = await fetchGenders();
    setGenders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    initGenders();
  }, []);

  return {
    genders,
    isLoading,
  };
}
