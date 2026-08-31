import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VisitTracker from '@/components/VisitTracker'
import BottomTabBar from '@/components/BottomTabBar'
import FloatingCS from '@/components/FloatingCS'

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
  themeColor: '#FFFFFF',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KOGEMCON" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <BottomTabBar />
            <FloatingCS />
        <VisitTracker />
      </body>
    </html>
  )
}
