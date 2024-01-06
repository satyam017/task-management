'use client'
import { auth } from '@/utils/firebase';
import { removeUser } from '@/utils/slices/userSlice';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';


const Sidebar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch()
  const handleLogout = () => {
    signOut(auth)
    .then(() => {
      router.push('/login');
      dispatch(removeUser(''))
      
    })
    .catch((error) => {
      
    });
  };
  const user = useSelector((state: any) => state.user)
  if(!user){
    return null
  }
  return (
      <div className="bg-gray-800 w-64 h-screen sticky top-0">
        <div className="p-4">
          <div className="text-2xl font-bold text-white">Your Logo</div>
        </div>
        <nav className="p-2">
          <ul>
            <li className="mb-2">
              <Link href={'/dashboard'} className="block p-2 hover:bg-gray-700">Dashboard</Link>
            </li>
            
            <li className="mb-2">
            {
              user.role === 'admin' ? <Link href={'/user'} className="block p-2 hover:bg-gray-700">User List</Link> : <Link href={'/task-management'} className="block p-2 hover:bg-gray-700">Task Management</Link> 
            }
              
            </li>
            <li className="mb-2">
              <button onClick={handleLogout} className="block p-2 hover:bg-gray-700">Logout</button>
            </li>
          </ul>
        </nav>
      </div>
  );
};

export default Sidebar;
