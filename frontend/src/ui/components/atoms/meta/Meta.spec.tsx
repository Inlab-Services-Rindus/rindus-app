import { Meta } from '@/ui/components/atoms/meta/Meta';

import { render, waitFor } from '@testing-library/react';

const metaConstants = {
  URL: 'www.app.rindus.de',
  TITLE: 'Rindus App',
  DESCRIPTION:
    'Join our vibrant community and connect with fellow "rinders". Explore talents, languages, and tech together, fostering bonds and sparking innovation!',
  TWITTER_PROFILE: '@_rindus_',
};

vi.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Meta', () => {
  it('should render the correct title', async () => {
    render(<Meta />);

    await waitFor(() => {
      expect(document.title).toEqual(metaConstants.TITLE);
    });
  });

  it('should render the correct description', () => {
    render(<Meta />);

    const description = document.querySelector('meta[name="description"]');

    expect(description?.getAttribute('content')).toEqual(
      metaConstants.DESCRIPTION,
    );
  });

  it('should render the correct og:title', () => {
    render(<Meta />);

    const ogTitle = document.querySelector('meta[property="og:title"]');

    expect(ogTitle?.getAttribute('content')).toEqual(metaConstants.TITLE);
  });

  it('should render the correct og:description', () => {
    render(<Meta />);

    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    );

    expect(ogDescription?.getAttribute('content')).toEqual(
      metaConstants.DESCRIPTION,
    );

    it('should render the correct og:image', () => {
      render(<Meta />);

      const ogImage = document.querySelector('meta[property="og:image"]');

      expect(ogImage?.getAttribute('content')).toEqual(
        '%PUBLIC_URL%/images/meta-rindus-app.webp',
      );
    });

    it('should render the correct og:url', () => {
      render(<Meta />);

      const ogUrl = document.querySelector('meta[property="og:url"]');

      expect(ogUrl?.getAttribute('content')).toEqual(metaConstants.URL);
    });

    it('should render the correct twitter:card', () => {
      render(<Meta />);

      const twitterCard = document.querySelector('meta[name="twitter:card"]');

      expect(twitterCard?.getAttribute('content')).toEqual(
        'summary_large_image',
      );
    });

    it('should render the correct twitter:site', () => {
      render(<Meta />);

      const twitterSite = document.querySelector('meta[name="twitter:site"]');

      expect(twitterSite?.getAttribute('content')).toEqual(
        metaConstants.TWITTER_PROFILE,
      );
    });

    it('should render the correct twitter:title', () => {
      render(<Meta />);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twitterTitle?.getAttribute('content')).toEqual(
        metaConstants.TITLE,
      );
    });

    it('should render the correct twitter:description', () => {
      render(<Meta />);

      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]',
      );

      expect(twitterDescription?.getAttribute('content')).toEqual(
        metaConstants.DESCRIPTION,
      );
    });

    it('should render the correct twitter:image', () => {
      render(<Meta />);

      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      expect(twitterImage?.getAttribute('content')).toEqual(
        '%PUBLIC_URL%/images/meta-rindus-app.webp',
      );
    });

    it('should render the correct canonical link', () => {
      render(<Meta />);

      const canonicalLink = document.querySelector('link[rel="canonical"]');

      expect(canonicalLink?.getAttribute('href')).toEqual(metaConstants.URL);
    });
  });
});
