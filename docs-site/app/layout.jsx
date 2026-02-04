import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'Treido Documentation',
    template: '%s – Treido Documentation',
  },
  description: 'Product, business, and engineering documentation for Treido Marketplace',
}

const logo = (
  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    Treido Docs
    <span
      style={{
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.06em',
        padding: '0.15rem 0.4rem',
        borderRadius: 6,
        background: 'rgb(250, 204, 21)',
        color: 'rgb(17, 24, 39)',
      }}
    >
      INTERNAL
    </span>
  </span>
)

const navbar = (
  <Navbar
    logo={logo}
    projectLink="https://treido.eu"
  />
)

const footer = (
  <Footer>
    Treido Marketplace © {new Date().getFullYear()}
  </Footer>
)

const docsRepositoryBase = process.env.NEXT_PUBLIC_DOCS_REPOSITORY_BASE

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head
        backgroundColor={{
          dark: 'rgb(17, 17, 17)',
          light: 'rgb(250, 250, 250)',
        }}
        color={{
          hue: { dark: 200, light: 200 },
          saturation: { dark: 100, light: 100 },
        }}
      />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          {...(docsRepositoryBase
            ? { docsRepositoryBase, editLink: 'Edit this page' }
            : {})}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          footer={footer}
          feedback={{ content: null }}
          toc={{ float: true, title: 'On This Page' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
