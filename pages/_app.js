import '../styles/globals.css'
import AppLayout from '../layouts/appLayout'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps }  }) {
  // if(Component.getLayout) {
  //   return Component.getLayout(
  //     <SessionProvider session={pageProps.session}>
  //       <Component {...pageProps} />
  //     </SessionProvider>
  //   )
  // }
  const getLayout = Component.getLayout ?? ((page) => page)

  if(Component.getLayout) {
    return (
      <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    )
  }
  
  return (
    <SessionProvider session={session}>
      <AppLayout>
          <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  )
}
