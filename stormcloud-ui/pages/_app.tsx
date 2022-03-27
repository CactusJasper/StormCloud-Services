import React from 'react';
import '../styles/main.scss';
import Head from 'next/head';
import { Footer, Nav } from '../components';

// @ts-ignore
export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Stormcloud</title>
            </Head>
            <Nav/>
            <Component {...pageProps}/>
            <Footer/>
        </>
    );
}
