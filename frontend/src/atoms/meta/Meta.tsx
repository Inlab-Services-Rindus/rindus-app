import { Helmet } from 'react-helmet-async';

export function Meta() {
  return (
    <Helmet>
      <title>Rindus App</title>
      <meta
        name="description"
        content="Join our vibrant community and connect with fellow 'rinders.' Explore talents, languages, and tech together, fostering bonds and sparking innovation!"
      />

      {/* Meta tags for Meta, Linkedin, WhatsApp */}
      <meta property="og:title" content="Rindus App" />
      <meta
        property="og:description"
        content="Join our vibrant community and connect with fellow 'rinders.' Explore talents, languages, and tech together, fostering bonds and sparking innovation!"
      />
      <meta
        property="og:image"
        content="%PUBLIC_URL%/images/meta-rindus-app.webp"
      />
      <meta property="og:url" content="URL of your webpage" />
      <meta property="og:image" content="" />

      {/* Tags for Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@_rindus_" />
      <meta name="twitter:title" content="Rindus App" />
      <meta
        name="twitter:description"
        content="Join our vibrant community and connect with fellow 'rinders.' Explore talents, languages, and tech together, fostering bonds and sparking innovation!"
      />
      <meta
        name="twitter:image"
        content="%PUBLIC_URL%/images/meta-rindus-app.webp"
      />

      <link rel="canonical" href="www.app.rindus.de" />
    </Helmet>
  );
}
