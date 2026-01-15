import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: {
    default: 'Amazong Docs',
    template: '%s – Amazong Docs',
  },
  description: 'Internal documentation for Amazong Marketplace',
}

const logo = (
  <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    🛒 Amazong Docs
  </span>
)

const navbar = (
  <Navbar
    logo={logo}
    projectLink="https://github.com/AmazongMarketplace/amazong"
  />
)

const footer = (
  <Footer>
    Amazong Marketplace © {new Date().getFullYear()}
  </Footer>
)

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
          docsRepositoryBase="https://github.com/AmazongMarketplace/amazong/tree/main/docs-site"
          editLink="Edit this page"
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
