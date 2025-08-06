// hooks/useAdminAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export function useAdminAuth() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.is_staff || res.data.is_superuser) {
          setAuthorized(true);
        } else {
          localStorage.removeItem('accessToken');
          router.push('/admin/login');
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  return { authorized, loading };
}
