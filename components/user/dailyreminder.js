import useSWR, { mutate } from 'swr'
import axios from 'axios'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { AiFillFlag, AiFillStar } from 'react-icons/ai'
import { RegularInput, RegularTextArea } from "./inputs"
import { RegularButton, TaskDateTimeButton, TaskDateTimeButton2, TaskIconButton } from "./buttons"
import { fetcher, truncate } from '../functions'

const priorityOptions = [
    {priority: 'P1', title: 'High Priority'},
    {priority: 'P2', title: 'Medium Priority'},
    {priority: 'P3', title: 'Low Priority'},
    {priority: 'P4', title: 'No Priority'}
]

const DailyReminder = ({ isReminderMdlClosed, reminderMdlCloseHandler }) => {
    const router = useRouter()
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data:categories } = useSWR(['http://localhost:8000/api/user/categories', userToken], fetcher)

    const [activeTab, setActiveTab] = useState(0)
    return (
        <div 
            className={` items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 ${isReminderMdlClosed ? ' hidden ' : ' flex flex-col'}`} 
        >   
            <div className='bg-task-ss-white-100 w-[90%] md:w-[600px] h-auto rounded-lg mt-[5%] relative z-20 '>
                {/* add task form */}
                    <div className='flex flex-wrap items-center py-3 px-5'>
                        <h2 className='font-semibold text-lg mr-4'>Daily Reminder</h2>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                    
                    <div className='bg-task-ss-white-200 overflow-hidden hover:overflow-auto'>
                        <div className='flex'>
                            <button className={`p-5 ${activeTab == 0 && 'bg-task-ss-white-100'}`} onClick={() => setActiveTab(0)}>Today</button>
                            <button className={`p-5 ${activeTab == 1 && 'bg-task-ss-white-100'}`} onClick={() => setActiveTab(1)}>Overdue Tasks</button>
                            <button className={`p-5 ${activeTab == 2 && 'bg-task-ss-white-100'}`} onClick={() => setActiveTab(2)}>All Tasks</button>
                        </div>
                    </div>
                    <div className='pt-2 pb-10 px-5'>
                        hello
                    </div>

                    {/* cancel and add task button */}
                    <hr className='text-task-ss-white-300'/>
                    <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                        <RegularButton 
                            type='pmry' 
                            title='Okay, Thanks!' 
                            eventType='button'
                            event={reminderMdlCloseHandler}
                        />
                    </div>
            </div>

            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={reminderMdlCloseHandler}
            ></div>
        </div>
    )
}
 
export default DailyReminder