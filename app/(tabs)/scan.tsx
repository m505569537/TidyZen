import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ScanTab() {
  useEffect(() => {
    router.push('/camera');
  }, []);
  return null;
}
