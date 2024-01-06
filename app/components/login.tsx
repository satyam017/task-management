// pages/login.tsx
'use client'
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import { useRouter } from 'next/navigation';


const Login: React.FC = () => {
  // const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    signInWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          router.push('/dashboard');
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode + "-" + errorMessage);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email" type="email" placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password" type="password" placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" onClick={handleLogin}>
            Login
          </button>

        </form>
        <Link href={'/signup'} className='text-black'>Dont have an account ?</Link>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </main>
  );
};

export default Login;
