import Link from 'next/link'
import { useState } from 'react'
import { IconButton, SideNavButton, SideCategoryButton } from './buttons'
import { FiInbox } from 'react-icons/fi'
import { MdClose, MdListAlt } from 'react-icons/md'
import { BiStar, BiCalendarCheck, BiCalendar, BiPlus } from 'react-icons/bi'
import { TbReportAnalytics } from 'react-icons/tb'
import { FiChevronDown } from 'react-icons/fi'

// side nav button data
const sideNavTitle = [
    {icon: FiInbox, title: 'Inbox', link: '/#'},
    {icon: BiStar, title: 'Starred', link: '/#'},
    {icon: MdListAlt, title: 'To Do List', link: '/#'},
    {icon: BiCalendarCheck, title: 'To Be Done', link: '/#'},
    {icon: BiCalendar, title: 'Calendar', link: '/#'},
    {icon: TbReportAnalytics, title: 'Productivity Reports', link: '/#'},
]

const SideNavbar = ({ isToggled, toggleHandler }) => {
    const [isCatClosed, setIsCatClosed] = useState(false)
    const catCloseHandler = () => setIsCatClosed(!isCatClosed)

    return (
        <div className={`bg-task-ss-dark-blue-300 drop-shadow-xl fixed w-80 h-full pb-10 lg:relative overflow-y-auto ${isToggled ? 'hidden' : null }`} >
            {/* close button section */}
            <div className='flex justify-end lg:hidden'>
                <IconButton 
                    icon={<MdClose className='text-task-ss-white-100' size={18} />} 
                    event={toggleHandler}
                />
            </div>

            {/* logo section */}
            <img src='/task_ss_logo.png' className='w-28 mx-auto my-8'/>

            {/* user side nav profile section */}
            <SideNavProfile username='Sample Name' />
            
            {/* side navs buttons (mapping/looping) */}
            {sideNavTitle.map((item, index) => (
                <SideNavButton
                    key={index.toString()}
                    icon={<item.icon size={24}/>} 
                    title={item.title}
                    link={item.link}
                />
            ))}

            {/* category add & dropdown section */}
            <div className='flex justify-between items-center '>
                <div className=' bg-task-ss-white-200 w-2 h-10 rounded-r-xl scale-0'></div>
                <div className='flex justify-between items-center w-11/12 text-task-ss-white-300 pr-5 py-3 cursor-pointer hover:bg-task-ss-dark-blue-200 hover:text-task-ss-white-100'>
                    <Link href='/categories/'>
                        <p className='ml-4 text-md font-light'>Categories</p>
                    </Link>
                    <div className='flex'>
                        <i className='hover:text-task-ss-light-blue-200'><BiPlus /></i>
                        <i 
                            className={`ml-2 hover:text-task-ss-light-blue-200 ${isCatClosed ? 'rotate-90' : null }`}
                            onClick={catCloseHandler}
                        ><FiChevronDown /></i>
                    </div>
                </div>
            </div>
            
            {/* user's list of categories at sidenavbar section */}
            <div className={`${isCatClosed ? 'scale-y-0' : null }`}>
                <SideCategoryButton />
            </div>
        </div>
    )
}

// component for user side profile
export const SideNavProfile = ({ img, username }) => (
    <div className='flex justify-between items-center bg-task-ss-white-100 max-w-max p-2 my-6 mx-auto rounded-full'>
        <div className=' bg-task-ss-dark-blue-200 w-10 h-10 rounded-full'>

        </div>
        <p className='ml-4 mr-6 text-lg font-medium'>{username}</p>
    </div>
)
 
export default SideNavbar