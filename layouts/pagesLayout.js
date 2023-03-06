import Head from 'next/head'
import { Rubik } from '@next/font/google'
import TopNavbar from '../components/user/topnavbar'

const rubik = Rubik({ subsets: ['latin'] })

const PagesLayout = ({ children }) => {
    return (
        <>
            <Head>
                <title>Task SS</title>
                <meta name="description" content="Task SS: A Smart Scheduler and Task Manager Application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={rubik.className}>
                <TopNavbar />
                <div className='pt-14 h-[calc(100vh+3.5rem)]'>
                    <div className='flex flex-col justify-center items-center h-[calc(100vh-3.5rem)] overflow-y-auto'>
                    {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PagesLayout