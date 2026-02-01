import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="tr">
            <Head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#4f46e5" />
                <link rel="apple-touch-icon" href="/icon.png" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
