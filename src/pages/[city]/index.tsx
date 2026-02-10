import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import CurrentTimeAndIftarCountdown from '@/components/time/currentTime';
import { getAllCitySlugs, getCityFromSlug, getCitySlug } from '@/utils/slugify';
import { turkeyLocations } from '@/data/turkeyLocations';
import Link from 'next/link';

interface CityPageProps {
    city: string;
    citySlug: string;
    districts: { name: string; slug: string }[];
}

const CityPage = ({ city, citySlug, districts }: CityPageProps) => {
    const title = `${city} İftar Vakti 2026 - Sahur ve İmsak Saatleri | İftarVaktim`;
    const description = `${city} için güncel iftar vakti, sahur saatleri ve Ramazan imsakiyesi 2026. ${city} bugün iftara ne kadar kaldı? Diyanet uyumlu namaz vakitleri.`;
    const canonicalUrl = `https://iftarvaktim.com/${citySlug}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description: description,
        url: canonicalUrl,
        isPartOf: {
            '@type': 'WebSite',
            name: 'İftarVaktim',
            url: 'https://iftarvaktim.com'
        },
        about: {
            '@type': 'City',
            name: city,
            containedInPlace: {
                '@type': 'Country',
                name: 'Türkiye'
            }
        }
    };

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />

                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:site_name" content="İftarVaktim" />
                <meta property="og:locale" content="tr_TR" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />

                <meta name="keywords" content={`${city} iftar vakti, ${city} sahur, ${city} imsak, ${city} namaz vakitleri, ${city} imsakiye 2026, ramazan ${city}`} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <main className="min-h-screen relative flex items-center justify-center py-10 bg-background text-gray-800">
                <div className="relative z-10 w-full max-w-7xl px-4">
                    <CurrentTimeAndIftarCountdown initialCity={city} />

                    {districts.length > 0 && (
                        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">{city} İlçeleri İftar Vakitleri</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {districts.map(d => (
                                    <Link
                                        key={d.slug}
                                        href={`/${citySlug}/${d.slug}`}
                                        className="text-sm text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        {d.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = getAllCitySlugs();
    const paths = slugs.map(slug => ({ params: { city: slug } }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const citySlug = params?.city as string;
    const city = getCityFromSlug(citySlug);

    if (!city) {
        return { notFound: true };
    }

    const districtNames = turkeyLocations[city] || [];
    const districts = districtNames.map(name => ({
        name,
        slug: getCitySlug(name), // reuse toSlug logic
    }));

    return {
        props: {
            city,
            citySlug,
            districts,
        },
    };
};

export default CityPage;
