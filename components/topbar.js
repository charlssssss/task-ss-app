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
import { BsBellFill, BsGearFill, BsCheckCircle } from 'react-icons/bs'
import { MdOutlineAccountCircle, MdOutlineBlock, MdListAlt } from 'react-icons/md'

const settingsTitle = [
    {icon: <MdOutlineAccountCircle />, title: 'Account', link: '/#'},
    {icon: MdOutlineBlock, title: 'Website Blocker', link: '/#'},
    {icon: BiPalette, title: 'Customize Theme', link: '/#'},
    {icon: BsCheckCircle, title: 'Completed Tasks', link: '/#'},
    {icon: TbPuzzle, title: 'Link to Google', link: '/#'},
    {icon: BiStar, title: 'Pro Subscription', link: '/#'},
    {icon: <TbLogout />, title: 'Log Out', link: '/#'}
]

// component for top bar
const Topbar = ({ toggleHandler }) => {
    const router = useRouter()

    // get token
    const { data: session } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }
    //console.log(userToken)

    // logout function (destroy token then session)
    const handleLogout =  async (e) => {
        e.preventDefault()
        const res = await axios('http://127.0.0.1:8000/api/user/auth/logout', { 
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + userToken }
        })
        if(res) {
            await signOut({ redirect: false })
            .then(() => router.push("/"))
        }
        console.log(res)
    }
    
    const [hoverSetting, setHoverSetting] = useState(false)
    const [hoverAdd, setHoverAdd] = useState(false)

    return (
        <div className='bg-task-ss-white-100 flex items-center w-full h-14'>
            <div className='mx-8 w-screen'>
                <div className='flex justify-between'>
                    <div>
                        <IconButton 
                            icon={<FaBars className='text-task-ss-dark-blue-300' size={18} />} 
                            hover={true}
                            event={toggleHandler}
                        />
                        <IconButton 
                            icon={<ImHome className='text-task-ss-dark-blue-300' size={18} />}
                            link='/user/dashboard'
                            hover={true}
                        />
                    </div>
                    
                    <div className='flex'>
                        <div 
                            onMouseEnter={()=> setHoverAdd(true)}
                            onMouseLeave={()=> setHoverAdd(false)}
                        >
                            <IconButton 
                                icon={<GrAdd className='text-task-ss-dark-blue-300' size={18} />}
                                event={null}
                                hover={true}
                            />
                            {/* add task button (add todolist task or tobedone task) */}
                            <div className={`absolute top-10 right-[118px] pt-6  ${hoverAdd ? '' : 'hidden' }`}>
                                <div className='bg-task-ss-white-100 rounded-xl py-3 w-52 drop-shadow-md'>
                                    <span className='flex items-center px-5 py-2 text-task-ss-white-400  rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'>
                                        <MdListAlt className='text-task-ss-light-blue-200' />
                                        <p className='text-sm ml-2'>To Do List</p>
                                    </span>

                                    <hr className='text-task-ss-white-300 mx-2 my-2' />

                                    <span className='flex items-center px-5 py-2 text-task-ss-white-400  rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'>
                                        <BiCalendarCheck className='text-task-ss-light-blue-200' />
                                        <p className='text-sm ml-2'>To Be Done</p>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <IconButton 
                            icon={<BsBellFill className='text-task-ss-dark-blue-300' size={18} />}
                            event={null}
                            hover={true}
                        />
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

                                    {/* settings buttons (mapping/looping) */}
                                    {settingsTitle.map((item, index) => {
                                        if(index != 0 && index != settingsTitle.length-1) {
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
                                    <div className='mx-2'>
                                        <button 
                                            className='flex items-center px-5 py-2 w-full text-task-ss-white-400 rounded-lg hover:bg-task-ss-white-200 hover:text-task-ss-white-500'
                                            onClick={handleLogout}
                                        >
                                            {settingsTitle[settingsTitle.length-1].icon} 
                                            <p className='text-sm ml-2'>{settingsTitle[settingsTitle.length-1].title}</p>
                                        </button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SettingsButton = ({ title, link, icon }) => {
    return (
        <Link href={link} className='flex items-center px-5 py-2 text-task-ss-white-400 rounded-lg mx-2 hover:bg-task-ss-white-200 hover:text-task-ss-white-500'>
            {icon}
            <p className='text-sm ml-2'>{title}</p>
        </Link>
    )
}
 
export default Topbar