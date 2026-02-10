import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import CurrentTimeAndIftarCountdown from '@/components/time/currentTime';
import { getAllCityDistrictPairs, getCityFromSlug, getDistrictFromSlug } from '@/utils/slugify';
import Link from 'next/link';

interface DistrictPageProps {
    city: string;
    district: string;
    citySlug: string;
    districtSlug: string;
}

const DistrictPage = ({ city, district, citySlug }: DistrictPageProps) => {
    const title = `${district}, ${city} İftar Vakti 2026 - Sahur Saatleri | İftarVaktim`;
    const description = `${city} ${district} için güncel iftar vakti, sahur saatleri ve Ramazan imsakiyesi 2026. ${district} bugün iftara ne kadar kaldı? Diyanet uyumlu namaz vakitleri.`;
    const canonicalUrl = `https://iftarvaktim.com/${citySlug}/${district.toLowerCase()}`;

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
            '@type': 'AdministrativeArea',
            name: district,
            containedInPlace: {
                '@type': 'City',
                name: city,
                containedInPlace: {
                    '@type': 'Country',
                    name: 'Türkiye'
                }
            }
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Ana Sayfa',
                    item: 'https://iftarvaktim.com'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: `${city} İftar Vakti`,
                    item: `https://iftarvaktim.com/${citySlug}`
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${district} İftar Vakti`,
                }
            ]
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

                <meta name="keywords" content={`${district} iftar vakti, ${district} ${city} sahur, ${district} imsak, ${district} namaz vakitleri, ${city} ${district} imsakiye 2026`} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </Head>

            <main className="min-h-screen relative flex items-center justify-center py-10 bg-background text-gray-800">
                <div className="relative z-10 w-full max-w-7xl px-4">
                    <CurrentTimeAndIftarCountdown initialCity={city} initialDistrict={district} />

                    <div className="max-w-4xl mx-auto mt-6">
                        <nav className="text-sm text-gray-500 flex items-center gap-1">
                            <Link href="/" className="hover:text-primary-600 transition-colors">Ana Sayfa</Link>
                            <span>›</span>
                            <Link href={`/${citySlug}`} className="hover:text-primary-600 transition-colors">{city}</Link>
                            <span>›</span>
                            <span className="text-gray-800 font-medium">{district}</span>
                        </nav>
                    </div>
                </div>
            </main>
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const pairs = getAllCityDistrictPairs();
    const paths = pairs.map(({ citySlug, districtSlug }) => ({
        params: { city: citySlug, district: districtSlug },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const citySlug = params?.city as string;
    const districtSlug = params?.district as string;

    const city = getCityFromSlug(citySlug);
    const district = getDistrictFromSlug(citySlug, districtSlug);

    if (!city || !district) {
        return { notFound: true };
    }

    return {
        props: {
            city,
            district,
            citySlug,
            districtSlug,
        },
    };
};

export default DistrictPage;
