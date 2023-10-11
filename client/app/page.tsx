'use client';

import { LeaderboardRow } from '@/components/leaderboard-row';
import { LeaderboardTop3 } from '@/components/leaderboard-top-3';
import { getApiUrl } from '@/hooks/api-url';
import { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import loadingSpinner from '@/public/spinner.svg';

type PersonData = [string, { MoneyRaised: number; Name: string }];

const Home: NextPage = () => {
  const apiUrl = getApiUrl();

  const [data, setData] = useState<PersonData[] | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/getTopPeople`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(err => console.error('Error:', err));
  }, []);

  if (!data)
    return (
      <div className='w-full h-screen'>
        <div className='font-headers text-center font-bold mt-4 text-2xl md:text-4xl lg:text-6xl'>GiveAThn Leaderboard</div>{' '}
        {/* unknown character is unique to this font - for styling purposes only */}
        <div className='grid place-items-center mt-4'>
          <Image src={loadingSpinner} alt='loading' />
        </div>
      </div>
    );

  return (
    <div className='w-full h-screen'>
      <div className='font-headers text-center font-bold mt-4 text-2xl md:text-4xl lg:text-6xl'>GiveAThn Leaderboard</div>{' '}
      {/* unknown character is unique to this font - for styling purposes only */}
      <div className='w-[calc(100%-20px)] md:w-[80%] m-auto'>
        <div className='mt-2 lg:mt-6 grid grid-flow-col gap-[6px]'>
          {data.length !== 0 && (
            <>
              {data.length >= 2 && <LeaderboardTop3 name={data[1][1].Name} email={data[1][0]} moneyRaised={data[1][1].MoneyRaised} rank={2} animationDelay={200} />}
              {data.length >= 1 && <LeaderboardTop3 name={data[0][1].Name} email={data[0][0]} moneyRaised={data[0][1].MoneyRaised} rank={1} animationDelay={300} />}
              {data.length >= 3 && <LeaderboardTop3 name={data[2][1].Name} email={data[2][0]} moneyRaised={data[2][1].MoneyRaised} rank={3} animationDelay={100} />}
            </>
          )}
        </div>
        <div className='fade-in glass-effect rounded-lg px-4 mt-[6px] text-xl' style={{ animationDelay: '400ms' }}>
          <div className='border-b-2 mb-1'>
            <div className='flex justify-between font-bold'>
              <h1 className='text-md md:text-xl lg:text-2xl'>#</h1>
              <h1 className='text-md md:text-xl lg:text-2xl'>$ Raised</h1>
              <h1 className='text-md md:text-xl lg:text-2xl'>Name</h1>
            </div>
          </div>
          {data.length !== 0 &&
            data.slice(3).map((data, index) => <LeaderboardRow name={data[1].Name} email={data[0]} moneyRaised={data[1].MoneyRaised} rank={index} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
