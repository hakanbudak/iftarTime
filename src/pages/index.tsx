import Head from 'next/head';
import CurrentTimeAndIftarCountdown from "@/components/time/currentTime";

export default function Home() {
  const title = 'İftar Vakti 2026 - Sahur ve Namaz Vakitleri | İftarVaktim';
  const description = 'Türkiye genelinde güncel iftar vakti, sahur saatleri ve Ramazan imsakiyesi 2026. Bugün iftara ne kadar kaldı? Diyanet uyumlu namaz vakitleri, şehir ve ilçe bazlı.';
  const canonicalUrl = 'https://iftarvaktim.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'İftarVaktim',
    url: canonicalUrl,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${canonicalUrl}/{search_term_string}`,
      'query-input': 'required name=search_term_string'
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

        <meta name="keywords" content="iftar vakti, sahur vakti, namaz vakitleri, imsakiye 2026, ramazan, iftar saati, iftara ne kadar kaldı" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <main className="min-h-screen relative flex items-center justify-center py-10 bg-background text-gray-800">
        <div className="relative z-10 w-full max-w-7xl px-4">
          <CurrentTimeAndIftarCountdown />
        </div>
      </main>
    </>
  );
}
