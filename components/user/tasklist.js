import useSWR from 'swr'
import axios from 'axios'
import moment from 'moment'
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Empty, FailedToLoad, Loading } from './errors'
import { fetcher, handleDeleteTask, truncate } from '../functions'
import { AiOutlineCalendar, AiFillStar, AiOutlineEdit, AiOutlineDelete  } from 'react-icons/ai'
import EditTask from './edittask'
import { BsCheck, BsFillCircleFill } from 'react-icons/bs'

const priorityStyles = {
    'P1' : { style:' border-2 bg-priority-high-100 border-priority-high-200 text-priority-high-200 '},
    'P2' : { style:' border-2 bg-priority-med-100 border-priority-med-200 text-priority-med-200 '},
    'P3' : { style:' border-2 bg-priority-low-100 border-priority-low-200 text-priority-low-200 '},
    'P4' : { style:' border bg-priority-default-100 border-priority-default-200 text-priority-default-200 '} 
}
   
// component for task list
const TaskList = ({ api, token, url }) => {
    const router = useRouter()

    const { data: session } = useSession()

    // fetch data
    const { data, error, isLoading } = useSWR([api, token], fetcher)

    // front end variables
    const [hover, setHover] = useState(false)
    const [hoverCheckBtn, setHoverCheckBtn] = useState(false)
    const [current, setCurrent] = useState('')

    // edit task modal
    const [isTaskMdlClosed, setIsTaskMdlClosed] = useState(true)
    const taskMdlCloseHandler = () => setIsTaskMdlClosed(!isTaskMdlClosed)

    const[editTask, setEditTask] = useState({})

    // complete task function
    const handleCompleteTask =  async (e, task) => {
        e.preventDefault()
        await axios(`http://127.0.0.1:8000/api/user/tasks/${task.id}`, { 
            method: 'PUT',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify({ 
                "task_name" : task.task_name,
                "status"    : "completed",
                "priority"  : task.priority
            }),
        })
        .then(res => {
            if(res.data.success) {
                alert("Task successfully completed!")
                router.push(url)
            } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error)
            const errorMsg = JSON.parse(error.request?.response)
            alert(errorMsg.errors)
        })
    }
    
    // handle errors
    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />
    
    const filteredTasks = data.data.filter(task => task.status == 'pending')
    
    if(filteredTasks.length == 0) return <Empty user={session.user.firstname} title={`${url} tasks`} img='/illustration_1.png' />

    return (
        <>
            {filteredTasks.map(task => {
                // formatting date and time
                const startDate = moment(`${task.start_date} ${task.start_time}`).calendar({
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: 'MMM D'
                })
                const endDate = moment(`${task.end_date} ${task.end_time}`).calendar({
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: 'MMM D'
                })
                const startTime = moment(task.start_time, 'HH:mm:ss').format('h:mma')
                const endTime = moment(task.end_time, 'HH:mm:ss').format('h:mma')

                return (
                    <div key={task.id} >
                        <div
                            className='flex justify-between py-4 w-full rounded-xl' 
                            href={`/user/categories/${task.category_id}/tasks/${task.id}`} 
                            onMouseEnter={()=> { setHover(true); setCurrent(task.id) }} 
                            onMouseLeave={()=> { setHover(false); setCurrent('') }}
                        >
                            <div className='flex items-start w-full'>
                                <button className='mt-2 mr-4' 
                                    onMouseEnter={()=> setHoverCheckBtn(true)} 
                                    onMouseLeave={()=> setHoverCheckBtn(false)}
                                >
                                    <div className={`rounded-full w-5 h-5 flex justify-center items-center transition-all ${priorityStyles[task.priority].style}`}
                                        onClick={(e) => handleCompleteTask(e, task)}
                                    >
                                        <BsCheck className={hoverCheckBtn && current == task.id ? null : 'hidden'} />
                                    </div>
                                </button>
                                <div className='flex flex-col w-full'>
                                    {/* task info */}
                                    <div className='flex justify-between h-8'>
                                        <div className='flex items-center'>
                                            {task.is_starred == 1 ? <AiFillStar className='text-task-ss-yellow pr-[5px]' size={20}/> : null}
                                            <p className='text-md'>{truncate(task.task_name, 70)}</p>
                                        </div>
                                        {/* edit, delete part */}
                                        <div className={`flex items-center text-task-ss-white-400 ${(hover &&  current == task.id) ? '' : 'hidden'}`}>
                                            <span onClick={() => {
                                                taskMdlCloseHandler()
                                                setEditTask(task)
                                            }}>
                                                <AiOutlineEdit size={20} className='m-[5px] transition-all hover:text-task-ss-white-500' />
                                            </span>
                
                                            <span onClick={(e) => handleDeleteTask(e, task.id, token, url, router)}>
                                                <AiOutlineDelete size={20} className='ml-[5px] transition-all hover:text-task-ss-white-500'/>
                                            </span>
                                        </div>
                                    </div>

                                    <p className='text-sm text-task-ss-white-400'>{truncate(task.task_desc, 45)}</p>
                                    <div className='flex flex-wrap justify-between items-center text-xs text-task-ss-white-400'>
                                        <div className='flex flex-wrap'>
                                            {/* start date */}
                                            {task.task_type_id == 2 && (
                                                <div className='flex flex-wrap text-task-ss-green-200 mr-4'>
                                                    <AiOutlineCalendar size={15} />
                                                    <p className='px-[5px]'>{startDate}</p>
                                                    <p>{startTime}</p>
                                                </div>
                                            )}

                                            {/* end date */}
                                            <div className='flex flex-wrap text-task-ss-orange'>
                                                <AiOutlineCalendar size={15} />
                                                <p className='px-[5px]'>{endDate}</p>
                                                <p>{endTime}</p>
                                            </div>
                                        </div>
                                        
                                        {task.category && 
                                            <div className='flex ml-auto items-center'>
                                                <p className='text-[14px] text-task-ss-white-400'>{task?.category?.category_name}</p>
                                                <BsFillCircleFill className={`ml-2 text-task-ss-category-${task?.category?.color}`} size={10} />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <hr className='text-task-ss-white-300'/>
                    </div>
                )         
            })}

            <EditTask 
                isTaskMdlClosed={isTaskMdlClosed} 
                taskMdlCloseHandler={taskMdlCloseHandler}
                editTask={editTask} 
                callbackUrl={url}
            />
        </>
    )
}

export default TaskList