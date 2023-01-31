import Head from 'next/head'
import { useState } from 'react'
import { Rubik } from '@next/font/google'
import Topbar from "../components/topbar"
import SideNavbar from "../components/sidenavbar"

// If loading a variable font, you don't need to specify the font weight
const rubik = Rubik({ subsets: ['latin'] })

const Layout = ({ children }) => {
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
                        <main className='container mx-auto px-10 py-5 lg:px-32 lg:py-14 '>
                        {children}
                        </main>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
    
}
 
export default Layout;