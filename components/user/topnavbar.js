import Link from 'next/link'
import { FaBars } from 'react-icons/fa'
import { GrClose } from 'react-icons/gr'
import { useSession } from "next-auth/react"
import { useState } from 'react'

// component for top bar
const TopNavbar = () => {
    // get session
    const { data: session } = useSession()

    const [isToggled, setIsToggled] = useState(false)
    const toggleHandler = () => setIsToggled(!isToggled)
    const toggleCloseHandler = () => setIsToggled(false)
    
    return (
        <>
        <div className='bg-task-ss-white-100 flex items-center drop-shadow-lg w-full h-14 fixed z-20'>
            <div className='mx-8 w-screen'>
                <div className='flex justify-between items-center'>
                    <Link href="/"
                        onClick={toggleCloseHandler}
                    >
                        <img src='/task_ss_logo_dark.png' className='h-8 w-auto'/>
                    </Link>

                    <div className='flex items-center lg:hidden'>
                        <button type='button' onClick={toggleHandler}>
                            {!isToggled ? 
                                <FaBars className='text-task-ss-dark-blue-300' size={18} />
                            :
                                <GrClose className='text-task-ss-dark-blue-300' size={18} />
                            }
                        </button>
                    </div>

                    <div className='lg:flex items-center hidden'>
                        <Link href="/#" className='text-task-ss-dark-blue-500 mr-8'>
                            <p className='text-sm'>Feedback</p>
                        </Link>  
                        <Link href="/pricing" className='text-task-ss-dark-blue-500 mr-8'>
                            <p className='text-sm'>Pricing</p>
                        </Link>
                    
                        <span className='mr-5 font-light text-task-ss-white-400'>|</span>
                        {!session ? (
                            <>
                                <Link href="/signup" className='text-task-ss-dark-blue-500 mr-8'>
                                    <p className='text-sm'>Signup</p>
                                </Link>
                                <Link href='/login' 
                                    className='bg-task-ss-purple text-task-ss-white-100 px-7 py-2 rounded-full active:scale-[0.98]'
                                >
                                    <p className='text-sm font-medium'>Login</p>
                                </Link>
                            </>
                        ) : (
                            <Link href='/login' className='bg-task-ss-purple text-task-ss-white-100 px-7 py-2 rounded-full active:scale-[0.98]'>
                                <p className='text-sm font-medium'>Open App</p>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* dropdown section for responsive */}
        <div className={`left-0 top-14 bg-task-ss-white-100 w-screen lg:hidden pt-10 pb-5 px-8 z-20 ${isToggled ? 'absolute' : 'hidden'}`}>
            <ul className='mb-5'>
                <li className='mb-5'>
                    <Link href="/#" className='text-task-ss-dark-blue-500'
                        onClick={toggleCloseHandler}
                    >
                        <p className='text-md'>Feedback</p>
                    </Link>
                </li>
                <li>
                    <Link href="/pricing" className='text-task-ss-dark-blue-500'
                        onClick={toggleCloseHandler}
                    >
                        <p className='text-md'>Pricing</p>
                    </Link>
                </li>
            </ul>

            <hr className='text-task-ss-white-300' />

            <div className='flex justify-center mt-5'>
                {!session ? (
                    <>
                        <Link href="/signup" 
                            className='bg-task-ss-white-300 mr-2 w-[50%] text-task-ss-dark-blue-300 px-7 py-2 rounded-full active:scale-[0.98]'
                        >
                            <p className='text-sm text-center'>Signup</p>
                        </Link>
                        <Link href='/login' 
                            className='bg-task-ss-purple ml-2 w-[45%] text-task-ss-white-100 px-7 py-2 rounded-full active:scale-[0.98]'
                        >
                            <p className='text-sm font-medium text-center'>Login</p>
                        </Link>
                    </>
                ) : (
                    <Link href='/login' className='bg-task-ss-purple text-task-ss-white-100 px-7 py-2 rounded-full active:scale-[0.98] w-full'>
                        <p className='text-sm font-medium text-center'>Open App</p>
                    </Link>
                )}
            </div>
        </div>

        {/* blur background */}
        <div 
            className={`bg-task-ss-dark-blue-600 bg-opacity-50 top-0 z-10 left-0 w-screen lg:hidden h-screen ${isToggled ? 'absolute' : 'hidden'}`} 
            onClick={toggleHandler} ></div>
        </>
    )
}
 
export default TopNavbar