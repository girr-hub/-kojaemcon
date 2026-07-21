import './globals.css'
import AdminButton from '@/components/AdminButton'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VisitTracker from '@/components/VisitTracker'
import BottomTabBar from '@/components/BottomTabBar'

export const metadata = {
  title: 'KOGEMCON · Find your Gems in Korea',
  description: 'Events, tours & meetups for foreigners in Korea',
  openGraph: {
    title: 'KOGEMCON · Find your Gems in Korea',
    description: 'Find your Gems in Korea — Events, tours & meetups for foreigners',
    siteName: 'KOGEMCON',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomTabBar />
        <AdminButton />
        <VisitTracker />
      </body>
    </html>
  )
}
