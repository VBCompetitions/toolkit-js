import '@/app/ui/global.css'
import { roboto } from '@/app/ui/fonts'
import { Metadata } from 'next'
import Banner from './ui/banner'
import { Box } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${roboto.className} antialiased min-h-screen`}>
        <AppRouterCacheProvider>
          <Box className='flex flex-col min-h-screen'>
            <Banner />
            <main className='flex flex-col grow'>
              {children}
            </main>
          </Box>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    template: '%s | VBC Toolkit',
    default: 'VBC Toolkit',
  },
  description: 'A bag of tools for working with VBCompetition competitions'
}
