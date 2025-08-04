import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProfileForm from '@/components/users/ProfileForm';
import api from '@/utils/axiosInstance';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/users/profile/')
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => router.push('/login'));
  }, []);

  if (loading) return <div className="p-6 text-green-700">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Move Back
      </button>
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
        Your Profile
      </h1>

      <ProfileForm initialData={profile} onSaved={setProfile} />
    </div>
  );
}
