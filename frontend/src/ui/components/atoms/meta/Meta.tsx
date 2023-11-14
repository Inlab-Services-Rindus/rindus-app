import { Helmet } from 'react-helmet-async';

const metaConstants = {
  URL: 'www.app.rindus.de',
  TITLE: 'Rindus App',
  DESCRIPTION:
    'Join our vibrant community and connect with fellow "rinders". Explore talents, languages, and tech together, fostering bonds and sparking innovation!',
  TWITTER_PROFILE: '@_rindus_',
};

export function Meta() {
  return (
    <Helmet>
      <title>{metaConstants.TITLE}</title>
      <meta name="description" content={metaConstants.DESCRIPTION} />

      {/* Meta tags for Meta, Linkedin, WhatsApp */}
      <meta property="og:title" content={metaConstants.TITLE} />
      <meta property="og:description" content={metaConstants.DESCRIPTION} />
      <meta
        property="og:image"
        content="%PUBLIC_URL%/images/meta-rindus-app.webp"
      />
      <meta property="og:url" content={metaConstants.URL} />
      <meta property="og:image" content="" />

      {/* Tags for Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={metaConstants.TWITTER_PROFILE} />
      <meta name="twitter:title" content={metaConstants.TITLE} />
      <meta name="twitter:description" content={metaConstants.DESCRIPTION} />
      <meta
        name="twitter:image"
        content="%PUBLIC_URL%/images/meta-rindus-app.webp"
      />

      <link rel="canonical" href={metaConstants.URL} />
    </Helmet>
  );
}
