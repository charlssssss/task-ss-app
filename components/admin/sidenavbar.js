import Link from 'next/link'
import useSWR from 'swr'
import { useState } from 'react'
import { useRouter } from "next/router"
import { FiInbox } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import { FiChevronDown } from 'react-icons/fi'
import { TbReportAnalytics } from 'react-icons/tb'
import { MdClose, MdListAlt, MdOutlineSpaceDashboard } from 'react-icons/md'
import { IconButton, SideNavButton, SideCategoryButton } from './buttons'
import { BiStar, BiCalendarCheck, BiCalendar, BiPlus } from 'react-icons/bi'
import { fetcher } from '../functions'
import { FailedToLoad, Loading } from './errors'

// side nav button data
const sideNavTitle = [
    {icon: MdOutlineSpaceDashboard, title: 'User Accounts', link: '/admin/useraccount'},
    {icon: FiInbox, title: 'Admin Accounts', link: '/admin/adminaccount'},
    {icon: BiStar, title: 'Subscriptions', link: '/admin/#'},
    {icon: MdListAlt, title: 'Sales Reports', link: '/admin/#'},
    {icon: TbReportAnalytics, title: 'Productivity Reports', link: '/admin/#'},
]

const SideNavbar = ({ isToggled, toggleHandler }) => {
    // for redirecting
    const router = useRouter()

    return (
        <div className={`bg-task-ss-dark-blue-300 drop-shadow-xl fixed h-full transition-all pb-10 -translate-x-[100%] overflow-x-hidden lg:relative overflow-y-hidden hover:overflow-y-auto  ${isToggled ? null : 'translate-x-[0px]' }`}
        >
            <div className='h-auto w-80'>
                {/* close button section */}
                <div className='flex justify-end sticky top-0 right-0 lg:hidden'>
                    <IconButton 
                        icon={<MdClose className='text-task-ss-white-100' size={18} />} 
                        event={toggleHandler}
                    />
                </div>

                {/* logo section */}
                <img src='/task_ss_logo.png' className='w-28 mx-auto my-8'/>

                {/* user side nav profile section */}
                <SideNavProfile />
                
                {/* side navs buttons (mapping/looping) */}
                {sideNavTitle.map((item, index) => (
                    <SideNavButton
                        key={index.toString()}
                        icon={<item.icon size={24}/>} 
                        title={item.title}
                        link={item.link}
                        router={router}
                    />
                ))}
            
            </div>
        </div>
    )
}

// component for user side profile
export const SideNavProfile = () => {
    const { data: session, status } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data, error, isLoading } = useSWR(['http://localhost:8000/api/user/profile', userToken], fetcher)

    const userName = `${data?.data?.firstname} ${data?.data?.lastname}`

    if (error) return <FailedToLoad color='text-task-ss-white-100' />
    if (isLoading) return <Loading color='text-task-ss-white-100' />

    return (
        <div className='flex justify-between items-center bg-task-ss-white-100 max-w-max p-2 my-6 mx-auto rounded-full'>
            <div className=' bg-task-ss-dark-blue-200 w-10 h-10 rounded-full flex justify-center items-center'>
                <h1 className='text-lg text-task-ss-white-100 font-medium'>{data?.data?.firstname.charAt(0)}</h1>
            </div>
            {status == 'loading' ? (
                <p className='ml-4 mr-6 text-lg font-medium'>loading...</p>
            ) : (
                <p className='ml-4 mr-6 text-lg font-medium'>{userName}</p>
            )}
        </div>
    )
}
 
export default SideNavbar