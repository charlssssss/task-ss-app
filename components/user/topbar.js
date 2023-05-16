import axios from 'axios'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IconButton } from './buttons'
import { GrAdd } from 'react-icons/gr'
import { FaBars } from 'react-icons/fa'
import { ImHome } from 'react-icons/im'
import { useRouter } from 'next/router'
import { TbPuzzle, TbLogout } from 'react-icons/tb'
import { useSession, signOut } from "next-auth/react"
import { BiPalette, BiStar, BiCalendarCheck } from 'react-icons/bi'
import { BsBellFill, BsGearFill, BsFillCalendarCheckFill, BsCheckCircle, BsSearch, BsCircleFill } from 'react-icons/bs'
import { MdOutlineAccountCircle, MdOutlineBlock, MdListAlt } from 'react-icons/md'
import { fetcher } from '../functions'

const settingsTitle = [
    {icon: <MdOutlineAccountCircle />, title: 'Account', link: '/user/account'},
    {icon: <MdOutlineBlock />, title: 'Website Blocker'},
    // {icon: BiPalette, title: 'Customize Theme', link: '/#'},
    {icon: BsCheckCircle, title: 'Completed Tasks', link: '/user/completed'},
    // {icon: TbPuzzle, title: 'Link to Google', link: '/#'},
    {icon: BiStar, title: 'Pro Subscription', link: '/pricing/subscribe'},
    {icon: <TbLogout />, title: 'Logout'}
]

// component for top bar
const Topbar = ({ toggleHandler, taskMdlCloseHandler, blockMdlCloseHandler, reminderMdlCloseHandler, setTaskType }) => {
    // for redirecting
    const router = useRouter()

    // get token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    let hasAudioPlayed
    if (typeof window !== 'undefined') hasAudioPlayed = localStorage?.getItem('hasAudioPlayed')

    const { data: notifs } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications`, userToken], fetcher)

    const hasNotifs = notifs?.data?.filter(notif => notif.status == 0 && notif.display == 1)

    const handlePlayAudio = () => {
        const audio = new Audio('/sounds/ring_sound_effects.mp3')
        audio.play()
    }

    useEffect(() => {
        mutate(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications`)
        if(hasNotifs?.length > 0 && hasAudioPlayed == 'false') {
            handlePlayAudio()
            localStorage?.setItem('hasAudioPlayed', 'true')
        }

        if(hasNotifs?.length == 0) {
            localStorage?.setItem('hasAudioPlayed', 'false')
        }
    }, [hasNotifs])

    // logout function (destroy token then session)
    const handleLogout =  (e) => {
        e.preventDefault()
        const res = axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/auth/logout`, { 
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + userToken }
        })
        if(res) {
            localStorage?.clear()
            signOut({ redirect: false })
            .then(() => router.push("/"))
        }
        // console.log(res)
    }
    
    // for 'dropdown' stuff on settings
    const [hoverSetting, setHoverSetting] = useState(false)
    const [hoverAdd, setHoverAdd] = useState(false)

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
                        <div className='hidden sm:inline-block'>
                        <IconButton 
                            icon={<ImHome className='text-task-ss-dark-blue-300' size={18} />}
                            link='/user/dashboard'
                            hover={true}
                        />
                        </div>
                        <IconButton 
                            icon={<BsSearch className='text-task-ss-dark-blue-300' size={18} />} 
                            hover={true}
                            link='/user/search'
                        />
                    </div>
                    
                    {/* right side add task, notif, and settings like logout */}
                    <div className='flex'>
                        <div 
                            onMouseEnter={()=> setHoverAdd(true)}
                            onMouseLeave={()=> setHoverAdd(false)}
                        >
                            <IconButton 
                                icon={<GrAdd className='text-task-ss-dark-blue-300' size={18} />}
                                event={() => {
                                    taskMdlCloseHandler()
                                    setTaskType('1')
                                }}
                                hover={true}
                            />
                            {/* add task button (add todolist task or tobedone task) */}
                            <div className={`absolute top-10 right-[118px] pt-6 z-10  ${hoverAdd ? '' : 'hidden' }`}>
                                <div className='bg-task-ss-white-100 rounded-xl py-3 w-52 drop-shadow-md'>
                                    <span 
                                        className='flex items-center px-5 py-2 cursor-pointer text-task-ss-white-400  rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'
                                        onClick={() => {
                                            taskMdlCloseHandler()
                                            setTaskType('1')
                                        }}
                                    >
                                        <MdListAlt className='text-task-ss-light-blue-200' />
                                        <p className='text-sm ml-2'>To Do List</p>
                                    </span>

                                    <hr className='text-task-ss-white-300 mx-2 my-2' />

                                    <span 
                                        className='flex items-center px-5 py-2 cursor-pointer text-task-ss-white-400  rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'
                                        onClick={() => {
                                            taskMdlCloseHandler()
                                            setTaskType('2')
                                        }}
                                    >
                                        <BiCalendarCheck className='text-task-ss-light-blue-200' />
                                        <p className='text-sm ml-2'>To Be Done</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='hidden sm:block'>
                            <IconButton 
                                icon={<BsFillCalendarCheckFill className='text-task-ss-dark-blue-300' size={18} />}
                                event={reminderMdlCloseHandler}
                                hover={true}
                            />
                        </div>

                        <Link href='/user/notifications' className='outline-none'>
                            <button className={`p-2 mr-2 rounded-md  hover:bg-task-ss-white-200 relative`}>
                                {hasNotifs?.length > 0 &&
                                    <BsCircleFill className='text-task-ss-red-200 absolute top-1 right-1' size={8} />
                                }
                                <BsBellFill className='text-task-ss-dark-blue-300' size={18} />
                            </button>
                        </Link>

                        <div 
                            onMouseEnter={()=> setHoverSetting(true)}
                            onMouseLeave={()=> setHoverSetting(false)}
                        >
                            <IconButton 
                                icon={<BsGearFill className='text-task-ss-dark-blue-300 ' size={18} />}
                                event={null}
                                hover={true}
                            />
                            <div className={`absolute top-10 right-[32px] pt-6 z-10  ${hoverSetting ? '' : 'hidden' }`}>
                                <div className='bg-task-ss-white-100 rounded-xl py-3 w-72 drop-shadow-md'>
                                    {/* account button */}
                                    <SettingsButton
                                            title={settingsTitle[0].title}
                                            link={settingsTitle[0].link}
                                            icon={settingsTitle[0].icon} 
                                    />

                                    <hr className='text-task-ss-white-300 mx-2 my-2' />

                                    <SettingsButton
                                            title={settingsTitle[1].title}
                                            icon={settingsTitle[1].icon}
                                            event={blockMdlCloseHandler}
                                    />

                                    {/* settings buttons (mapping/looping) */}
                                    {settingsTitle.map((item, index) => {
                                        if(index > 1 && index != settingsTitle.length-1) {
                                            return (
                                                <SettingsButton
                                                    key={index.toString()}
                                                    title={item.title}
                                                    link={item.link}
                                                    icon={<item.icon />} 
                                                />
                                            )
                                        }
                                    })}

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