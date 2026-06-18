import './globals.css'
import AdminButton from '@/components/AdminButton'
import Header from '@/components/Header'

export const metadata = { title: 'KOJAEMCON · Find your scene in Korea' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <main className="pt-16">{children}</main>
        <AdminButton/>
      </body>
    </html>
  )
}
