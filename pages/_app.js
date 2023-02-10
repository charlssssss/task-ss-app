import '../styles/globals.css'
import AppLayout from '../layouts/appLayout'

export default function App({ Component, pageProps }) {
  if(Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  return (
    <AppLayout>
        <Component {...pageProps} />
    </AppLayout>
  )
}
