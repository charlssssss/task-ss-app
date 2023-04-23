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
    {icon: MdOutlineSpaceDashboard, title: 'Dashboard', link: '/user/dashboard'},
    {icon: FiInbox, title: 'Inbox', link: '/user/inbox'},
    {icon: BiStar, title: 'Starred', link: '/user/starred'},
    {icon: MdListAlt, title: 'To Do List', link: '/user/todolist'},
    {icon: BiCalendarCheck, title: 'To Be Done', link: '/user/tobedone'},
    {icon: BiCalendar, title: 'Calendar', link: '/user/calendar'},
    {icon: TbReportAnalytics, title: 'Productivity Reports', link: '/user/reports'},
]

const SideNavbar = ({ isToggled, toggleHandler, catMdlCloseHandler }) => {
    // for redirecting
    const router = useRouter()

    // close action variables
    const [isCatClosed, setIsCatClosed] = useState(false)
    const catCloseHandler = () => setIsCatClosed(!isCatClosed)

    return (
        <div className={`bg-task-ss-dark-blue-300 drop-shadow-xl fixed h-full transition-all pb-10 -translate-x-[100%] overflow-x-hidden lg:relative overflow-y-hidden hover:overflow-y-auto z-10 ${isToggled ? null : 'translate-x-[0px]' }`}
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

                {/* category add & dropdown section */}
                <div className='flex justify-between items-center '>
                    <div className={`bg-task-ss-white-200 w-2 h-10 rounded-r-xl ${router.asPath == "/user/categories" ? 'scale-100' : 'scale-0'}`}></div>
                    <div className={`flex justify-between items-center w-11/12 text-task-ss-white-300 pr-5 py-3 cursor-pointer hover:bg-task-ss-dark-blue-200 hover:text-task-ss-white-100 ${router.asPath == "/user/categories" ? 'bg-task-ss-dark-blue-200' : '' }`}>
                        <Link href='/user/categories/'>
                            <p className='ml-4 text-md font-light'>Categories</p>
                        </Link>
                        <div className='flex'>
                            {/* add new category */}
                            <i className='hover:text-task-ss-light-blue-200' onClick={catMdlCloseHandler}>
                                <BiPlus />
                            </i>
                            
                            {/* hide/show category */}
                            <i 
                                className={`ml-2 hover:text-task-ss-light-blue-200 transition-all ${isCatClosed ? 'rotate-90' : null }`}
                                onClick={catCloseHandler}
                            >
                                <FiChevronDown />
                            </i>
                        </div>
                    </div>
                </div>
                
                {/* user's list of categories at sidenavbar section */}
                <div className={`${isCatClosed ? 'hidden' : 'block' }`}>
                    <SideCategoryButton router={router} />
                </div>
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
    if (isLoading) return <Loading color='text-task-ss-white-100' m='mb-10' />

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