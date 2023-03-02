import Head from 'next/head'
import { useState } from 'react'
import { Rubik } from '@next/font/google'
import Topbar from "../components/user/topbar"

// If loading a variable font, you don't need to specify the font weight
const rubik = Rubik({ subsets: ['latin'] })

const AdminLayout = ({ children }) => {
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
                <Topbar />
                <div className='h-[calc(100vh-3.5rem)] overflow-y-auto'>
                    <main className='container mx-auto px-10 py-5 lg:px-32 lg:py-14 '>
                    {children}
                    </main>
                </div>
            </div>
        </>
    )
    
}
 
export default AdminLayout