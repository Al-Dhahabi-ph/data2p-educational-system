import { useState, useEffect } from 'react';
import { ref, onValue, off, Database } from 'firebase/database';
import { useFirebase } from '../contexts/FirebaseContext';

export function useFirebaseData<T>(path: string, defaultValue: T) {
  const { database } = useFirebase();
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!database) return;

    const dataRef = ref(database, path);
    
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        try {
          const value = snapshot.val();
          setData(value || defaultValue);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          console.error('Firebase data error:', err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        console.error('Firebase subscription error:', err);
      }
    );

    return () => {
      off(dataRef, 'value', unsubscribe);
    };
  }, [database, path, defaultValue]);

  return { data, loading, error };
}
