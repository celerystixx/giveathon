'use client';

import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/lib/api-url';
import { LeaderboardAffiliationRow } from '@/components/leaderboard-a-row';
import { AffiliationData } from '@/app/leaderboards/affiliations/page';

export const AffiliationsComponent: FC = () => {
  const [affiliations, setAffiliations] = useState<AffiliationData[]>([]);
  const [dontFetch, setDontFetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const lastElementRef = useRef<HTMLDivElement>(null);
  const apiUrl = getApiUrl();

  const initialAffiliationCount = 10;
  const fetchMoreAmount = 5;
  const fetchLink = `${apiUrl}/getTopAffiliations`;
  const initalSkip = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(fetchLink, {
          limit: initialAffiliationCount,
          start: initalSkip
        });

        const data = response.data;
        setAffiliations(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching users [INITIAL]:', err);
      }
    };

    fetchUsers();
  }, [fetchLink]);

  useEffect(() => {
    const fetchMoreUsers = async () => {
      if (dontFetch) return;
      try {
        setDontFetch(true);

        const response = await axios.post(fetchLink, {
          limit: fetchMoreAmount,
          start: skip + initalSkip + initialAffiliationCount
        });

        const data = response.data;
        setAffiliations(prevAffiliations => [...prevAffiliations, ...data]);
        setSkip(prevSkip => prevSkip + fetchMoreAmount);
        if (data.length === 0) {
          setDontFetch(true);
          return;
        }
        setDontFetch(false);
      } catch (err) {
        console.error('Error fetching users [INCREMENTAL]:', err);
      }
    };

    const container = lastElementRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchMoreUsers();
        }
      },
      { threshold: 0.1 } // Adjust the threshold as needed
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [affiliations, skip, dontFetch, fetchLink]);

  if (isLoading) return null;

  return (
    <div className='fade-in glass-effect mb-[60px] rounded-lg p-2 px-4 text-xl' style={{ animationDelay: '400ms' }}>
      <div className='my-2'>
        <div className='grid grid-cols-[repeat(3,minmax(0,1fr))] font-bold'>
          <h1 className='text-md mr-auto md:text-xl lg:text-2xl'>#</h1>
          <h1 className='text-md text-center md:text-xl lg:text-2xl'>$ Raised</h1>
          <h1 className='text-md ml-auto md:text-xl lg:text-2xl'>Name</h1>
        </div>
      </div>
      {affiliations.length > 0 ? (
        affiliations.map((affiliation, index) => <LeaderboardAffiliationRow name={affiliation[0]} moneyRaised={affiliation[1]} rank={index + 4} key={index} />)
      ) : (
        <p className='p-2 text-center'>No other affiliations yet!</p>
      )}
      <div ref={lastElementRef} className='z-[-1] mt-[-600px] h-[600px] w-full text-center'></div>
    </div>
  );
};
