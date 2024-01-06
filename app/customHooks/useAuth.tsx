import { auth, db } from '@/utils/firebase';
import { addUser, removeUser } from '@/utils/slices/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, DocumentSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface AuthUser {
  uid: string;
  email: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const { uid, email, displayName } = authUser;
        setUser({ uid, email });

        try {
          const userDocRef = doc(db, 'users', uid);
          const userDocSnapshot: DocumentSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const { role } = userDocSnapshot.data();
            dispatch(addUser({ uid, email, displayName, role }));
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return { user, loading };
};
