import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { IconButton } from './buttons'
import { GrAdd } from 'react-icons/gr'
import { FaBars } from 'react-icons/fa'
import { ImHome } from 'react-icons/im'
import { useRouter } from 'next/router'
import { TbPuzzle, TbLogout } from 'react-icons/tb'
import { useSession, signOut } from "next-auth/react"
import { BiPalette, BiStar, BiCalendarCheck } from 'react-icons/bi'
import { BsBellFill, BsGearFill, BsCheckCircle, BsSearch } from 'react-icons/bs'
import { MdOutlineAccountCircle, MdOutlineBlock, MdListAlt } from 'react-icons/md'

const settingsTitle = [
    {icon: <MdOutlineAccountCircle />, title: 'Account', link: '/admin/#'},
    {icon: <TbLogout />, title: 'Logout'}
]

// component for top bar
const Topbar = ({ toggleHandler }) => {
    // for redirecting
    const router = useRouter()

    // get token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    // logout function (destroy token then session)
    const handleLogout =  (e) => {
        e.preventDefault()
        const res = axios('http://127.0.0.1:8000/api/user/auth/logout', { 
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + userToken }
        })
        if(res) {
            signOut({ redirect: false })
            .then(() => router.push("/"))
        }
        // console.log(res)
    }
    
    // for 'dropdown' stuff on settings
    const [hoverSetting, setHoverSetting] = useState(false)

    return (
        <div className='bg-task-ss-white-100 flex items-center w-full h-14'>
            <div className='mx-8 w-screen'>
                <div className='flex justify-between'>
                    {/* left side (hamburger and home button) */}
                    <div>
                        <IconButton 
                            icon={<FaBars className='text-task-ss-dark-blue-300' size={18} />} 
                            hover={true}
                            event={toggleHandler}
                        />
                        <IconButton 
                            icon={<ImHome className='text-task-ss-dark-blue-300' size={18} />}
                            link='/admin/useraccount'
                            hover={true}
                        />
                    </div>
                    
                    {/* right side add task, notif, and settings like logout */}
                    <div className='flex'>
                        <div 
                            onMouseEnter={()=> setHoverSetting(true)}
                            onMouseLeave={()=> setHoverSetting(false)}
                        >
                            <IconButton 
                                icon={<BsGearFill className='text-task-ss-dark-blue-300 ' size={18} />}
                                event={null}
                                hover={true}
                            />
                            <div className={`absolute top-10 right-[32px] pt-6  ${hoverSetting ? '' : 'hidden' }`}>
                                <div className='bg-task-ss-white-100 rounded-xl py-3 w-72 drop-shadow-md'>
                                    {/* account button */}
                                    <SettingsButton
                                            title={settingsTitle[0].title}
                                            link={settingsTitle[0].link}
                                            icon={settingsTitle[0].icon} 
                                    />

                                    <hr className='text-task-ss-white-300 mx-2 my-2' />

                                    {/* logout button */}
                                    <SettingsButton
                                            title={settingsTitle[settingsTitle.length-1].title}
                                            icon={settingsTitle[settingsTitle.length-1].icon}
                                            event={handleLogout}
                                    />            
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SettingsButton = ({ title, link, icon, event }) => {
    if(event) {
        return (
            <div className='mx-2'>
                <button className='flex items-center px-5 py-2 w-full text-task-ss-white-400 rounded-lg hover:bg-task-ss-white-200 hover:text-task-ss-white-500'
                    onClick={event}
                >
                    {icon}
                    <p className='text-sm ml-2'>{title}</p>
                </button>
            </div>
        )
    }
    return (
        <Link href={link} className='flex items-center px-5 py-2 text-task-ss-white-400 rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'>
            {icon}
            <p className='text-sm ml-2'>{title}</p>
        </Link>
    )
}
 
export default Topbar