import useSWR, { mutate } from 'swr'
import { useState } from "react"
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { currDate, fetcher } from '../functions'
import moment from 'moment'
import { BsFillCircleFill } from 'react-icons/bs'
import { Empty3 } from './errors'
import { RegularButton } from './buttons'

const listStyles = [
    { style : 'h-2 bg-task-ss-category-200' },
    { style : 'h-2 bg-task-ss-red-200' },
    { style : 'h-2 bg-task-ss-yellow h-2' },
]

const DailyReminder = ({ isReminderMdlClosed, reminderMdlCloseHandler }) => {
    const router = useRouter()
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data:todayTasks } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter?end_date=${currDate()}`, userToken], fetcher)
    const { data:overdueTasks } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter?status=overdue`, userToken], fetcher)
    const { data:pendingTasks } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks?status=pending`, userToken], fetcher)

    const [selectedTab, setSelectedTab] = useState(todayTasks)
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div 
            className={` items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 z-20 ${isReminderMdlClosed ? ' hidden ' : ' flex flex-col'}`} 
        >   
            <div className='bg-task-ss-white-100 w-[90%] md:w-[600px] h-auto rounded-lg mt-[2%] relative z-20 '>
                {/* add task form */}
                    <div className='flex flex-wrap items-center py-3 px-5'>
                        <h2 className='font-semibold text-lg mr-4'>Daily Reminder</h2>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                    
                    <div className='bg-task-ss-white-200 overflow-hidden hover:overflow-auto'>
                        <div className='flex'>
                            <TabButton
                                name='Today'
                                tabNum={0}
                                data={todayTasks}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setSelectedTab={setSelectedTab}
                            />

                            <TabButton
                                name='Overdue Tasks'
                                tabNum={1}
                                data={overdueTasks}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setSelectedTab={setSelectedTab}
                            />
                            <TabButton
                                name='Pending Tasks'
                                tabNum={2}
                                data={pendingTasks}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setSelectedTab={setSelectedTab}
                            />
                        </div>
                    </div>
                    <div className={listStyles[activeTab].style}></div>
                    <div className='py-5 px-8 h-[50vh] overflow-y-auto'>
                    {
                        selectedTab?.data.length > 0 ?
                            selectedTab?.data.slice(0,5).map((task, idx, arr) => {
                                let endDate = moment(task.end_date).format('LL')

                                if(idx > 0) {
                                    if(task.end_date != arr[idx - 1].end_date) {
                                        return (
                                            <div key={idx.toString()}>
                                                <p className='text-xs font-medium mt-2 mb-1'>{endDate}</p>   
                                                <TaskRow
                                                    name={task.task_name}
                                                    category={task.category}
                                                    time={task.end_time}
                                                    priority={task.priority}
                                                />
                                            </div>
                                        )
                                    }
                                    return (
                                        <TaskRow
                                            key={idx.toString()}
                                            name={task.task_name}
                                            category={task.category}
                                            time={task.end_time}
                                            priority={task.priority}
                                        />
                                    )
                                }
                                else {
                                    return (
                                        <div key={idx.toString()}>
                                            <p className='text-xs font-medium mt-2 mb-1'>{endDate}</p>   
                                            <TaskRow
                                                name={task.task_name}
                                                category={task.category}
                                                time={task.end_time}
                                                priority={task.priority}
                                            />
                                        </div>
                                    )
                                }
                            })
                        :
                        <Empty3
                            title='Tasks'
                            img='/illustration_3.png'
                            size='h-[50px]'
                            m='my-5'
                        />
                    }
                    </div>

                    {/* cancel and add task button */}
                    <hr className='text-task-ss-white-300'/>
                    <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                        <RegularButton 
                            type='pmry' 
                            title='Okay, Thanks!' 
                            eventType='button'
                            event={() => {
                                if(localStorage.getItem('firstLogin') == 'true') localStorage.setItem('firstLogin', 'false')
                                reminderMdlCloseHandler()
                            }}
                        />
                    </div>
            </div>

            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={() => {
                    if(localStorage.getItem('firstLogin') == 'true') localStorage.setItem('firstLogin', 'false')
                    reminderMdlCloseHandler()
                }}
            ></div>
        </div>
    )
}

const TabButton = ({ name, tabNum, data, activeTab, setActiveTab, setSelectedTab }) => {
    return(
        <button 
            className={`${activeTab == tabNum && 'bg-task-ss-white-100 drop-shadow-md'}`} 
            onClick={() => { setActiveTab(tabNum), setSelectedTab(data) }}
        >
            <p className='py-3 px-6 md:py-5 md:px-8 text-xs md:text-[15px]'>{name}</p>
        </button>
    )
}

const TaskRow = ({ name, category, time, priority }) => {
    const priorityOptions = {
        'P1' : {title: 'High', color: 'text-task-ss-red-200'},
        'P2' : {title: 'Medium', color: 'text-task-ss-yellow'},
        'P3' : {title: 'Low', color: 'text-task-ss-category-200'}
    }

    let endTime = 'no time'
    if(time) endTime = moment(time, 'HH:mm:ss').format('h:mm a')

    return (
        <div className='flex justify-between cursor-default py-2 px-3 transition-all hover:bg-task-ss-white-200'>
            <div className='flex flex-col text-xs'>
                <p>{name}</p>
                <div className='flex items-center'>
                    <BsFillCircleFill className={`mr-1 text-task-ss-category-${category.color}`} size={5} />
                    <p className='text-[10px]'>{category.category_name}</p>
                </div>
            </div>
            <div className='flex flex-col text-end text-xs items-end'>
                <p>{endTime}</p>
                <p className={`text-[10px] ${priorityOptions[priority]?.color}`}>{priorityOptions[priority]?.title}</p>
            </div>
        </div>
    )
}
 
export default DailyReminder