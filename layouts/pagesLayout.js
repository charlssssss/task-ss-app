import Head from 'next/head'
import { Rubik } from '@next/font/google'
import Link from 'next/link'
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
                    <div className='flex flex-col items-center h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden'>
                    <main>
                        {children}
                    </main>

                    <footer className='h-full w-screen bg-task-ss-white-100 border-t border-task-ss-white-300'>
                        <div className='w-[90%] mx-auto py-14'>

                            <div>
                                <Link href="/">
                                    <img src='/task_ss_logo_dark.png' className='h-8 w-auto mb-1'/>
                                </Link>
                                <p className='text-xs text-task-ss-white-400'>Copyright © 2023 Team GOAT Dev. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PagesLayout