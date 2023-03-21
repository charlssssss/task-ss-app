import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { GoPlus } from 'react-icons/go'
import { getSession } from 'next-auth/react'
import AddTask from '../../components/user/addtask'
import TitleHeader from '../../components/user/titleheader'
import { BsSquareFill, BsArrowRightShort } from 'react-icons/bs'
import { Empty2 } from '../../components/user/errors'
import { truncate } from '../../components/functions'

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[recent, tasks, completedCount, blockedkWebCount] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/user/tasks/recent', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/filter?status=completed', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/blockwebsites/includes', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                recent: recent.data.data, 
                tasks: tasks.data.data,
                completedCount: completedCount.data.data.length,
                blockedkWebCount: blockedkWebCount.data.data.length,
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { notFound: true }
    }
}

const Dashboard = ({recent, tasks, completedCount, blockedkWebCount }) => {
    // add task modal
    const [isTaskMdlClosed, setIsTaskMdlClosed] = useState(true)
    const taskMdlCloseHandler = () => setIsTaskMdlClosed(!isTaskMdlClosed)
    const [taskType, setTaskType] = useState('')

    const [showRecent, setShowRecent] = useState(false)
    
    const filteredTasks = tasks.filter(task => task.task_type_id == 1 && task.status == 'pending')

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

            <div className='flex flex-wrap mb-8'>
                <button className='flex flex-row-reverse lg:flex-col justify-between lg:justify-center items-center bg-task-ss-dark-blue-200 text-task-ss-white-100 px-10 w-full h-20 lg:h-44 lg:w-44 lg:mr-5 mb-5 transition-all active:scale-95'
                    onClick={() => { taskMdlCloseHandler(); setTaskType('1') }}
                >
                    <GoPlus className='lg:text-[70px] lg:mb-7' />
                    <span className='text-md lg:text-xs lg:font-medium' >Add New Task</span>
                </button>

                <LargeCard 
                    title='To Do List Tasks' 
                    count={filteredTasks.length.toString().padStart(2, '0')}  
                    link='/user/todolist' 
                    m='lg:mr-5 mb-5' 
                />
                <LargeCard 
                    title='Completed Tasks' 
                    count={completedCount.toString().padStart(2, '0')}  
                    link='/user/completed'
                    m='lg:mr-5 mb-5' 
                />
                <LargeCard 
                    title='Blocked Website' 
                    count={blockedkWebCount.toString().padStart(2, '0')}  
                    link='#' 
                    m=' mb-5' 
                />

            </div>

            <div className='flex flex-wrap justify-between'>
                <div className='flex flex-col mb-10 w-full xl:w-[58%]'>
                    <h4 className='text-xl mb-4'>Recent Tasks</h4>

                    <div className='flex flex-col'>
                        {recent.slice(0, 4).map(task => {
                            const dueDate = moment(`${task.end_date} ${task.end_time}`).calendar({
                                sameDay: '[Today]',
                                nextDay: '[Tomorrow]',
                                nextWeek: 'dddd',
                                lastDay: '[Yesterday]',
                                lastWeek: '[Last] dddd',
                                sameElse: 'MMM D'
                            })

                            let link = `/user/categories/${task.category_id}`
                            if(task.status == 'completed') link = '/user/completed'

                            return (
                                <RecentTask 
                                    key={task.id}
                                    title={task.task_name}
                                    status={task.status}
                                    dueDate={dueDate}
                                    priority={task.priority}
                                    category={task.category.category_name}
                                    color={task.category.color}
                                    link={link}
                                />
                            )
                        })}
                        <div className={showRecent ? 'block' : 'hidden'}>
                            {recent.slice(4, recent.length).map(task => {
                                const dueDate = moment(`${task.end_date} ${task.end_time}`).calendar({
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Yesterday]',
                                    lastWeek: '[Last] dddd',
                                    sameElse: 'MMM D'
                                })

                                let link = `/user/categories/${task.category_id}`
                                if(task.status == 'completed') link = '/user/completed'

                                return (
                                    <RecentTask 
                                        key={task.id}
                                        title={task.task_name}
                                        status={task.status}
                                        dueDate={dueDate}
                                        priority={task.priority}
                                        category={task.category.category_name}
                                        color={task.category.color}
                                        link={link}
                                    />
                                )
                            })}

                        </div>
                        {recent.length > 0 ? 
                            (recent.length > 4 &&
                                <button className='text-xs font-medium self-end mr-2 hover:underline'
                                    onClick={() => setShowRecent(!showRecent)}
                                >
                                    {showRecent ? 'Show Less' : 'Show More'}
                                </button>
                            )
                        :
                            <Empty2 title='recent tasks' img='/illustration_1.png' />
                        }
                    </div>
                </div>

                <div className='flex flex-col mb-10 w-full xl:w-[38%]'>
                    <h4 className='text-xl mb-4'>Reports</h4>

                    <div className='flex flex-col'>
                        <ProdReport title='Last Week' time='Mar 4 - Mar 9' />
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
        </>
    )
}

export const LargeCard = ({title, count, link, m}) => {
    return (
        <div className={`flex flex-col flex-wrap justify-center bg-task-ss-white-100 text-task-ss-dark-blue-200 px-8 w-full h-32 lg:h-44 lg:w-44 ${m}`}>
            <h2 className='text-sm text-task-ss-dark-blue-500'>{title}</h2>
            <div className='flex justify-between items-end lg:items-baseline lg:flex-col'>
                <h1 className='text-[40px] mt-2 lg:mb-4 '>{count}</h1>
                <Link href={link} className='text-xs font-medium align-bottom hover:underline'>View Full List</Link>
            </div>
        </div>
    )
}

export const RecentTask = ({title, status, dueDate, priority, category, color, link}) => {
    const priorityOptions = {
        'P1' : {title: 'High Priority'},
        'P2' : {title: 'Medium Priority'},
        'P3' : {title: 'Low Priority'},
        'P4' : {title: 'Not Priority'}
    }

    const statusStyles = {
        'pending' : {style: 'text-task-ss-yellow'},
        'completed' : {style: 'text-task-ss-green-200'},
        'overdue' : {style: 'text-task-ss-red-200'}
    }
    
    return (
        <Link href={link}>
            <div className='flex justify-between items-center py-4 px-6 w-full bg-task-ss-white-100 mb-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <BsSquareFill size={8} className={`mr-2 text-task-ss-category-${color}`} />
                        <h5 className='text-sm'>{truncate(title, 30)}</h5>
                    </div>
                    <p className='text-xs font-semibold mr-1'>{dueDate}</p>
                </div>

                <div className='flex flex-col items-end'>
                    <p className='text-xs font-medium'>{priorityOptions[priority].title}</p>
                    <span className='flex items-center'>
                        <p className={`text-[11px] ${statusStyles[status].style}`}>{status}</p>
                        
                    </span>
                </div>
            </div>
        </Link>
    )
}

export const ProdReport = ({title, time}) => {
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