'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../../utils/firebase";

import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addUser } from '@/utils/slices/userSlice';
import { useDispatch } from 'react-redux';

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();



  interface UserAuth {
    uid: any;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  
  const handleSignup = async () => {
    try {
      // Sign Up Logic
      createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredential) => {
        const user = userCredential.user;
  
        // Update user profile in Firestore
        updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        })
          .then(() => {
            const user: User | null = auth.currentUser;
  
            if (user) {
              const userDocRef = doc(db, 'users', user.uid);
              // Set user data including role
              setDoc(userDocRef, {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: role,
              });
  
              const userAuthData: UserAuth = {
                uid: user.uid ?? '',
                email: user.email ?? '',
                firstName: (user.displayName?.split(' ')[0]) ?? '',
                lastName: (user.displayName?.split(' ')[1]) ?? '',
                role: role,
              };
  
              dispatch(addUser(userAuthData));
              router.push('/dashboard');
            }
          })
          .catch((error) => {
            setError(error.message);
          });
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode + "-" + errorMessage);
      });
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  
  
  return (
    <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md ml-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign Up</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newEmail" type="text" placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newEmail" type="type" placeholder="Enter your password"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newEmail" type="email" placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword" type="password" placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleSignup}>
          Sign Up
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Signup;

