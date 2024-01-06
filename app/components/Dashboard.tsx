'use client'
import {  getDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import withAuth from './withAuth';
import { addUser, removeUser } from '@/utils/slices/userSlice';
import { User as FirebaseUser } from 'firebase/auth';
// ... (other imports)
export interface ExtendedUser extends FirebaseUser {
  role?: string; // Add the 'role' property to the User type
}
const Dashboard: React.FC = () => {

  const user = useSelector((store) => store);

  return (
    <h1 className="font-bold ">Welcome to the dashboard of Task Management System</h1>
  );
};

export default withAuth(Dashboard);
