import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { getSession } from 'next-auth/react'
import AddTask from '../../components/user/addtask'
import TitleHeader from '../../components/user/titleheader'
import { BsFillCircleFill, BsArrowRightShort } from 'react-icons/bs'
import { Empty2 } from '../../components/user/errors'
import { truncate } from '../../components/functions'
import WebsiteBlocker from '../../components/user/websiteblocker'

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[recent, upcomingTasks, completedCount, blockedkWebCount] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/user/tasks/recent', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/end_date/asc', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/filter?status=completed', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/blockwebsites/includes', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                recent: recent.data.data, 
                upcomingTasks: upcomingTasks.data.data,
                completedCount: completedCount.data.data.length,
                blockedkWebCount: blockedkWebCount.data.data.length,
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { notFound: true }
    }
}

const Dashboard = ({recent, upcomingTasks, completedCount, blockedkWebCount }) => {
    // add task modal
    const [isTaskMdlClosed, setIsTaskMdlClosed] = useState(true)
    const taskMdlCloseHandler = () => setIsTaskMdlClosed(!isTaskMdlClosed)
    const [taskType, setTaskType] = useState('')

    // add website blocker modal
    const [isBlockMdlClosed, setIsBlockMdlClosed] = useState(true)
    const blockMdlCloseHandler = () => setIsBlockMdlClosed(!isBlockMdlClosed)

    // recent tasks variables
    const [showRecent, setShowRecent] = useState(false)
    const totalTasks = upcomingTasks.filter(task => task.end_date != null)

    console.log(totalTasks)

    // reports variables
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const lastMonth = now.getMonth() - 1
    const lastYear = now.getFullYear() - 1
    
    return (
        <>
            <Head>
                <title>Dashboard: Task SS</title>
            </Head>

            <TitleHeader title='Dashboard' />

            <div className='flex flex-wrap justify-between mb-8'>
                {/* left/top panel */}
                <div className='flex flex-col w-full xl:w-[58%] mb-5'>
                    {/*Summaries panel */}
                    <div className='h-[135px] overflow-x-hidden hover:overflow-x-auto'>
                        <div className='w-[750px] flex'>
                            <AddTaskCard
                                taskMdlCloseHandler={taskMdlCloseHandler}
                                setTaskType={setTaskType}
                            />

                            <SmallCard 
                                title='Total Tasks' 
                                count={totalTasks.length.toString().padStart(2, '0')} 
                                link='/user/inbox' 
                            />
                            <SmallCard 
                                title='Completed Tasks' 
                                count={completedCount.toString().padStart(2, '0')} 
                                link='/user/completed' 
                            />
                            <SmallCard 
                                title='Overdue Tasks' 
                                count={'99'} 
                                link='/user/inbox' 
                            />
                            <SmallCard 
                                title='Block Websites' 
                                count={blockedkWebCount.toString().padStart(2, '0')}  
                                event={() => blockMdlCloseHandler()} 
                            />

                        </div>
                    </div>

                    {/* Upcoming Deadlines panel */}
                    <div className='flex flex-col w-full mt-2 mb-5'>
                        <h4 className='text-lg font-medium mb-2'>Upcoming Deadlines</h4>
                        
                        <div className='bg-task-ss-yellow h-2'></div>
                        <div className='flex flex-col bg-task-ss-white-100 px-5 py-3'>
                            {totalTasks.map((task, idx, arr) => {
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
                            })}

                        </div>
                    </div>

                </div>

                {/* right/bottom panel */}
                <div className='flex flex-col w-full xl:w-[38%]'>

                    {/* Overdue Tasks panel */}
                    <div className='flex flex-col w-full mb-5'>
                        <h4 className='text-lg font-medium mb-2'>Overdue Tasks</h4>

                        <div className='bg-task-ss-red-200 h-2'></div>
                        <div className='flex flex-col bg-task-ss-white-100 px-5 py-3'>
                            <p className='text-xs font-medium mt-2 mb-1'>March 4, 2023</p>
                            
                            <TaskRow
                                name={'hello'}
                                category={'hello'}
                                time={'hello'}
                                priority={'hello'}
                            />

                            <p className='text-xs font-medium mt-2 mb-1'>March 4, 2023</p>

                            

                        </div>
                    </div>

                    {/* Recent Tasks panel */}
                    <div className='flex flex-col w-full my-5'>
                        <h4 className='text-lg font-medium mb-2'>Recent Tasks</h4>

                        <div className='bg-task-ss-category-200 h-2'></div>
                        <div className='flex flex-col bg-task-ss-white-100 px-5 py-3'>
                            {recent.slice(0, 5).map((task, idx) => {
                                return (
                                    <TaskRow2
                                        key={idx.toString()}
                                        name={task.task_name}
                                        category={task.category}
                                        date={task.end_date ? `${task.end_date} ${task.end_time}` : null}
                                        priority={task.priority}
                                    />
                                )
                            })} 
                        </div>
                    </div>

                    <div className='flex flex-col my-5 w-full'>
                        <ProdReport title='Last Week' time='Mar4-Mar9' />
                        <ProdReport title='Last Month' time={months[lastMonth]} />
                        <ProdReport title='Last Year' time={lastYear} />

                    </div>

                </div>
            </div>

            <AddTask 
                isTaskMdlClosed={isTaskMdlClosed} 
                taskMdlCloseHandler={taskMdlCloseHandler} 
                taskType={taskType}
                setTaskType={setTaskType}
            />
            <WebsiteBlocker
                isBlockMdlClosed={isBlockMdlClosed} 
                blockMdlCloseHandler={blockMdlCloseHandler} 
            />
        </>
    )
}

const TaskRow = ({ name, category, time, priority }) => {
    const priorityOptions = {
        'P1' : {title: 'High', color: 'text-task-ss-red-200'},
        'P2' : {title: 'Medium', color: 'text-task-ss-yellow'},
        'P3' : {title: 'Low', color: 'text-task-ss-category-200'},
        'P4' : {title: 'Low', color: 'text-task-ss-category-200'}
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

const TaskRow2 = ({ name, category, date, priority }) => {
    let endDate = 'No Date'
    if(date) endDate = moment(date).calendar({
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'MMM D'
    })

    const priorityOptions = {
        'P1' : {title: 'High', color: 'text-task-ss-red-200'},
        'P2' : {title: 'Medium', color: 'text-task-ss-yellow'},
        'P3' : {title: 'Low', color: 'text-task-ss-category-200'},
        'P4' : {title: 'Low', color: 'text-task-ss-category-200'}
    }

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
                <p>{endDate}</p>
                <p className={`text-[10px] ${priorityOptions[priority]?.color}`}>{priorityOptions[priority]?.title}</p>
            </div>
        </div>
    )
}

const AddTaskCard = ({ taskMdlCloseHandler, setTaskType }) => {
    return (
        <button className='flex flex-col justify-center items-center bg-task-ss-dark-blue-200 text-task-ss-white-100 w-32 h-28 mr-3 transition-all active:scale-95'
            onClick={() => { taskMdlCloseHandler(); setTaskType('1') }}
        >
            <GoPlus className='text-[45px] mb-3'/>
            <span className='text-[9px]'>Add New Task</span>
        </button>
    )
}

const SmallCard = ({ title, count, link, event }) => {

    if(event) {
        return (
            <div className='flex flex-col items-center justify-between w-32 h-28 py-4 mr-3 text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default'>
                <p className='text-[11px] text-task-ss-dark-blue-500'>{title}</p>
                <p className='text-[30px]'>{count}</p>
                <button onClick={event} className='text-[9px] align-bottom hover:underline'>View full list</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-between w-32 h-28 py-4 mr-3 text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default'>
            <p className='text-[11px] text-task-ss-dark-blue-500'>{title}</p>
            <p className='text-[30px]'>{count}</p>
            <Link href={link} className='text-[9px] align-bottom hover:underline'>View full list</Link>
        </div>
    )
}

const ProdReport = ({title, time}) => {
    return (
        <div className='flex justify-between items-center py-5 px-6 w-full bg-task-ss-purple text-task-ss-white-100 mb-4'>
            <div className='flex flex-col'>
                <h5 className='text-sm font-light'>{title}</h5>
                <p className='text-xl font-medium'>{time}</p>
            </div>

            <BsArrowRightShort className='self-end' size={40} />
        </div>
    )
}

export default Dashboard