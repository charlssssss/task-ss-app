import Head from 'next/head'
import '../styles/globals.css'
import { Rubik } from '@next/font/google'
import SideNavbar from "../components/sidenavbar"
import Topbar from "../components/topbar"
import { useState } from 'react'

// If loading a variable font, you don't need to specify the font weight
const rubik = Rubik({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  if(Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />)
  }

  // frontend variables
  const [isToggled, setIsToggled] = useState(false)
  const toggleHandler = () => setIsToggled(!isToggled)

  return (
    <>
      <Head>
        <title>Task SS</title>
        <meta name="description" content="Task SS: A Smart Scheduler and Task Manager Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={rubik.className}>
        <div className='flex w-screen h-screen'>
          <SideNavbar isToggled={isToggled} toggleHandler={toggleHandler} />
          <div className={`w-full ${isToggled ? null : 'lg:w-[calc(100%-20rem)]' }`} >
              <Topbar toggleHandler={toggleHandler} />
              <div className='h-[calc(100vh-3.5rem)] overflow-y-auto'>
                  <Component {...pageProps} />
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
