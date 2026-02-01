import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import CurrentTimeAndIftarCountdown from '@/components/time/currentTime';
import { cityNamesMap } from '@/enums';

interface CityPageProps {
    city: string;
}

const CityPage = ({ city }: CityPageProps) => {
    const title = `${city} İftar Vakti 2026 - Sahur ve İmsak Saatleri | IftarVaktim`;
    const description = `${city} ili için en doğru iftar vakti, sahur saatleri ve Ramazan imsakiyesi. Bugün iftara ne kadar kaldı? 2026 Diyanet uyumlu namaz vakitleri.`;
    const canonicalUrl = `https://iftarvaktim.com/${city.toLowerCase()}`;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={canonicalUrl} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
            </Head>

            <CurrentTimeAndIftarCountdown initialCity={city} />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    // Get all unique city names
    const cities = Object.values(cityNamesMap);
    const uniqueCities = Array.from(new Set(cities));

    // Create paths for each city
    const paths = uniqueCities.map((city) => ({
        params: { city: city.toLowerCase() }, // URL will be lowercase, e.g., /istanbul
    }));

    // Add fallback: false to return 404 for undefined paths
    // However, since we might have English keys mapping to Turkish values, 
    // let's ensure we cover all bases. For now, strictly Turkish names in URL is fine.
    // If user types /Istanbul (capital), we might want to handle redirects, 
    // but Next.js file routing is case-sensitive on some servers.
    // For now, let's map lowercase versions.

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const cityParam = params?.city as string;

    // Find the correct proper casing for the city from our map
    const allCities = Object.values(cityNamesMap);
    const matchedCity = allCities.find(c => c.toLowerCase() === cityParam.toLowerCase());

    if (!matchedCity) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            city: matchedCity,
        },
    };
};

export default CityPage;
