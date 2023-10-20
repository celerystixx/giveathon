import Navbar from '@/components/navbar/navbar';
import './globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GiveAThon 2023 🕷️',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body dir='ltr'>
        <div className='flex bg-hero bg-cover w-full text-white'>{children}</div>
      </body>
    </html>
  );
}
