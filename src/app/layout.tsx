import './globals.css'
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
        <script dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1065020046258827');
          fbq('track', 'PageView');
        `}} />
        <noscript><img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=1065020046258827&ev=PageView&noscript=1" /></noscript>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomTabBar />
        <VisitTracker />
      </body>
    </html>
  )
}
