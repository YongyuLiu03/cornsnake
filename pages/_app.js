import '@/styles/globals.css'
import Navbar from '@/components/Navbar';
import '../styles.css'
import Footer from '@/components/Footer';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import { AuthProvider, useAuth } from '@/hooks/useAuth';

export default function App({ Component, pageProps }) {

  
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   async function fetchUserData() {
  //     const res = await fetch('/api/user');
  //     const data = await res.json();
  //     setUser(data.user);
  //   }
  //   fetchUserData();
  // }, []);

  return (
    <>
      <Head>
        <title>Cornsnake wiki</title>
      </Head>
      <AuthProvider>
        {/* {user ? ( */}
          <main className={inter.className}>
            <Navbar/>
            <Component {...pageProps} />
            {/* <Footer /> */}
          </main>
        {/* ) : (
          <p>Loading...</p>
        )} */}
      </AuthProvider>
    </>
  )
}
