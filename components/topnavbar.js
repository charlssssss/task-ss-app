import Link from 'next/link'
import { useSession } from "next-auth/react"

// component for top bar
const TopNavbar = () => {
    // get session
    const { data: session } = useSession()

    // console.log(session)

    return (
        <div className='bg-task-ss-white-100 flex items-center drop-shadow-xl w-full h-14 fixed z-10'>
            <div className='mx-8 w-screen'>
                <div className='flex justify-between items-center'>
                    <Link href="/">
                        <img src='/task_ss_logo_dark.png' className='h-8 w-auto'/>
                    </Link>

                    <div className='flex items-center'>  
                        {!session ? (
                            <>
                                <Link href="/signup" className='text-task-ss-dark-blue-500 mr-5'>
                                    <p className='text-sm font-medium'>Sign up</p>
                                </Link>
                                <Link href='/auth/login' 
                                    className='bg-task-ss-purple text-task-ss-white-100 px-7 py-2 rounded-full'
                                >
                                    <p className='text-sm font-medium'>Log In</p>
                                </Link>
                            </>
                        ) : (
                            <Link href='/auth/login' className='bg-task-ss-purple text-task-ss-white-100 px-7 py-2 rounded-full'>
                                <p className='text-sm font-medium'>Open App</p>
                            </Link>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default TopNavbar