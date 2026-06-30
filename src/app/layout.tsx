import './globals.css'
import AdminButton from '@/components/AdminButton'
import VisitTracker from '@/components/VisitTracker'
import Header from '@/components/Header'

export const metadata = { title: 'KOJAEMCON · Find your scene in Korea' }
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <main className="pt-16">{children}</main>
        <AdminButton/>
        <VisitTracker/>
      </body>
    </html>
  )
}
