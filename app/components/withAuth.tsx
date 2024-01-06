'use client';
import { useRouter }  from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../customHooks/useAuth';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '@/utils/slices/userSlice';


const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = () => {
    const router = useRouter();
    const { user, loading } = useAuth(); 
   
    useEffect(() => {
      if (!user && !loading) {
        router.push('/login'); 
      }
    }, [user, loading, router]);

    if (loading) {
      return <p>Loading...</p>; 
    }

    return <WrappedComponent />;
  };

  return Wrapper;
};

export default withAuth;
