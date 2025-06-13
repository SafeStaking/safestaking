import type { AppProps } from 'next/app';
import DynamicProvider from '../providers/DynamicProvider';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DynamicProvider>
      <Component {...pageProps} />
    </DynamicProvider>
  );
}