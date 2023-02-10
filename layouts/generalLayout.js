import Head from 'next/head'
import { Rubik } from '@next/font/google'

const rubik = Rubik({ subsets: ['latin'] })

const GeneralLayout = ({ children }) => {
    return (
        <>
            <Head>
                    <title>Task SS</title>
                    <meta name="description" content="Task SS: A Smart Scheduler and Task Manager Application" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
            <div className={rubik.className}>
                {children}
            </div>
        </>
    )
}

export default GeneralLayout