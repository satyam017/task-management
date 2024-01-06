'use client'
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import withAuth from '../withAuth';

// Define the User interface
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Define the UserList component
const UserList = () => {
  // State to store the fetched users
  const [users, setUsers] = useState<User[]>([]);

  // useEffect to fetch users when the component mounts
  const fetchUsers = async () => {
    try {
      
      const usersCollection = collection(db, 'users');
  
      const usersSnapshot = await getDocs(usersCollection);
  
      const usersData: User[] = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          firstName: data.firstName, 
          lastName: data.lastName,
          email: data.email, 
        };
      });
  
  
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  useEffect(() => {
   fetchUsers()
  }, []); 

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <table className="min-w-full bg-white border border-gray-300 text-black">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{users.length }</td>
              <td className="py-2 px-4 border-b">{user.firstName + ' '+user.lastName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td> 
              <td className="py-2 px-4 border-b">
                <a href={`/task-management?userId=${user.id}`} className="text-blue-500 hover:underline">
                  Go to Tasks
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export the UserList component wrapped with the withAuth HOC
export default withAuth(UserList);
