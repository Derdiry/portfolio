import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  path?: string
  type?: 'website' | 'profile' | 'article'
  structuredData?: Record<string, unknown>
}

const SITE = 'Mohamed Alderdiry'
const BASE_URL = 'https://moderdiry.com'
const OG_IMAGE = `${BASE_URL}/og-image.jpg`

export default function Seo({ title, description, path = '', type = 'website', structuredData }: SeoProps) {
  const fullTitle = path === '' ? `${SITE} — Applied ML Engineer` : `${title} | ${SITE}`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
