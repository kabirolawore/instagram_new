import Header from '@/components/Header';
import { signIn as SignIntoProvider, getProviders } from 'next-auth/react';

function signIn({ providers }) {
  return (
    <>
      <Header />
      <div
        className='flex flex-col items-center justify-center min-h-screen 
      py-2 -mt-5 px-14 text-center'
      >
        <img className='w-80' src='https://links.papareact.com/ocw' alt='' />
        <p className=' italic'>
          This is an Instagram project created by Kabir Olawore from OGTL
          Acedemy
        </p>
        <div className='mt-40'>
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className='p-3 bg-blue-500 rounded-lg text-white'
                onClick={() =>
                  SignIntoProvider(provider.id, { callbackUrl: '/' })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default signIn;
