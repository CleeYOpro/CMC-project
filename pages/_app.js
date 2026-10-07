import { useMemo } from "react";
import Head from "next/head";
import { TinaProvider, TinaCMS } from "tinacms";
import "../styles.css";

export default function App({ Component, pageProps }) {
  const cms = useMemo(
    () =>
      new TinaCMS({
        enabled: typeof window !== "undefined" && window?.location?.search?.includes("edit"),
      }),
    []
  );

  return (
    <TinaProvider cms={cms}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/Images/logo.png" />
        <link href="https://fonts.googleapis.com/css?family=Domine&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap" rel="stylesheet" />
        <script src="https://kit.fontawesome.com/2ec8e7d68d.js" crossOrigin="anonymous" defer></script>
      </Head>
      <Component {...pageProps} />
    </TinaProvider>
  );
}
