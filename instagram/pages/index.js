import Feed from '@/components/Feed';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Head from 'next/head';

export default function Home() {
  return (
    <div className='bg-gray-50 h-screen overflow-scroll scrollbar-hide'>
      <Head>
        <title>Instagram</title>
        <link rel='icon' href='../public/favicon.ico' />
      </Head>
      <Header />
      <Feed />
      <Modal />
    </div>
  );
}
