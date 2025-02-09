'use client';

import { LeaderboardTop3 } from '@/components/leaderboard-top-3';
import { getApiUrl } from '@/lib/api-url';
import { NextPage } from 'next';
import Image from 'next/image';
import loadingSpinner from '@/public/spinner.svg';
import { UsersComponent } from '@/components/users-component';
import axios from 'axios';
import { Countdown } from '@/components/countdown';
import { useEffect, useState } from 'react';
import { TotalRaised } from '@/components/total-raised';
import { RecentDonations } from '@/components/recent-donations';
import AdvisoryTop from '@/components/advisory-top';

export type PersonData = [string, { MoneyRaised: number; Name: string }];

const UsersLeaderboardPage: NextPage = () => {
  const apiUrl = getApiUrl();
  const [data, setData] = useState<PersonData[] | null>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/getTopPeople`, { limit: 3, start: 0 });
        setData(response.data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  if (!isMounted) return null;

  if (!data)
    return (
      <>
        <div className='h-screen w-full pt-16'>
          <div className='fade-in glass-effect font-headers mx-auto mt-4 w-1/2 rounded-lg text-center text-2xl font-bold md:text-4xl lg:text-6xl'>GiveAThn Leaderboard</div>{' '}
          {/* unknown character is unique to this font - for styling purposes only */}
          <div className='mt-4 grid place-items-center'>
            <Image src={loadingSpinner} alt='loading' />
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className='h-screen w-full pt-16'>
        <div className='fade-in glass-effect font-headers mx-auto mt-4 w-1/2 rounded-lg text-center text-3xl md:text-4xl lg:text-6xl'>GiveAThon Leaderboard</div>{' '}
        {/* unknown character is unique to this font - for styling purposes only */}
        <div className='m-auto mt-4 grid w-[calc(100%-20px)] grid-flow-row gap-2 md:mt-8 md:w-[80%]'>
          <Countdown />
          <TotalRaised />
          <RecentDonations />
          <div className='relative mt-[70px] flex w-full items-end gap-[6px] md:mt-[125px]'>
            {data.length !== 0 && (
              <>
                {data.length >= 2 && (
                  <div className='h-[calc(100%+30px)] w-full md:h-[calc(100%+50px)]'>
                    <LeaderboardTop3 name={data[1][1].Name} email={data[1][0]} moneyRaised={data[1][1].MoneyRaised} rank={2} animationDelay={200} />
                  </div>
                )}
                {data.length >= 1 && (
                  <div className='h-[calc(100%+60px)] w-full md:h-[calc(100%+100px)]'>
                    <LeaderboardTop3 name={data[0][1].Name} email={data[0][0]} moneyRaised={data[0][1].MoneyRaised} rank={1} animationDelay={300} />
                  </div>
                )}
                {data.length >= 3 && (
                  <div className='h-max w-full'>
                    <LeaderboardTop3 name={data[2][1].Name} email={data[2][0]} moneyRaised={data[2][1].MoneyRaised} rank={3} animationDelay={100} />
                  </div>
                )}
              </>
            )}
          </div>
          <UsersComponent />
        </div>
      </div>
    </>
  );
};

export default UsersLeaderboardPage;
