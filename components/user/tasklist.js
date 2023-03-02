import useSWR from 'swr'
import axios from 'axios'
import moment from 'moment'
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Empty, FailedToLoad, Loading } from './errors'
import { AiOutlineCalendar, AiFillStar, AiOutlineEdit, AiOutlineDelete  } from 'react-icons/ai'

// fetcher function for useSWR hook
// const fetcher = (...args) => fetch(...args).then(res => res.json())
const fetcher = ([url, token]) => 
    axios.get(url, { headers: { 'Authorization': 'Bearer ' + token }
   }).then(res => res.data)
   
// component for task list
const TaskList = ({ api, token, url }) => {
    const router = useRouter()

    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    // fetch data
    const { data, error, isLoading } = useSWR([api, token], fetcher)

    // front end variables
    const [hover, setHover] = useState(false)
    const [current, setCurrent] = useState('')
    const [deleted, setDeleted] = useState(null)

    // delete task function
    const handleDeleteTask =  async (e, id) => {
        e.preventDefault()
        // confirmation
        if(confirm(`Are you sure u want to delete task no.${id}?`) ) {
            const { data } = await axios(`http://127.0.0.1:8000/api/user/tasks/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            })
    
            if(data.success) {
                router.push(url)
                setDeleted(id)
                alert(data.message)
            } else { console.log(data.message) }
        }
    }

    // handle errors
    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    if(data.data.length == 0) return <Empty user={session.user.firstname} title={`${url} tasks`} img='/illustration_1.png' />

    return (
        <>
            {data.data.map(task => {
                
                if(deleted != task.id) {
                    // formatting date and time
                    const startDateTime = `${task.start_date} ${task.start_time}`
                    const endDateTime = `${task.end_date} ${task.end_time}`

                    return (
                        <div
                            key={task.id} 
                            className='flex justify-between py-4 px-7 w-full rounded-xl hover:bg-task-ss-white-300' 
                            href={`/user/categories/${task.category_id}/tasks/${task.id}`} 
                            onMouseEnter={()=> { setHover(true); setCurrent(task.id) }} 
                            onMouseLeave={()=> { setHover(false); setCurrent('') }}
                        >
                            <div className='flex items-start'>
                                <button className='mt-2 mr-4'>
                                    <div className={`rounded-full w-5 h-5 border border-1 border-task-ss-white-400`}></div>
                                </button>
                                <div className='flex flex-col'>
                                    {/* task info */}
                                    <div className='flex items-center'>
                                        {task.is_starred == 1 ? <AiFillStar className='text-task-ss-yellow' size={17}/> : null}
                                        <p className='font-normal pl-[5px]'>{task.task_name}</p>
                                    </div>
                                    <p className='text-sm text-task-ss-white-400'>{task.task_desc}</p>
                                    <div className='flex items-center text-xs text-task-ss-white-400'>
                                        {/* start date */}
                                        <div className='flex text-task-ss-green-200'>
                                            <AiOutlineCalendar size={15} />
                                            <p className='px-[5px]'>{moment(startDateTime).format('MMM D, YYYY')}</p>
                                            <p>{moment(startDateTime).format('H:mm')}</p>
                                        </div>
    
                                        <p className='px-2'>to</p>
                                        
                                        {/* end date */}
                                        <div className='flex text-task-ss-orange'>
                                            <AiOutlineCalendar size={15} />
                                            <p className='px-[5px]'>{moment(endDateTime).format('MMM D, YYYY')}</p>
                                            <p>{moment(endDateTime).format('H:mm')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* edit, delete part */}
                            <div className={`flex items-center text-task-ss-white-400 ${(hover &&  current == task.id) ? '' : 'hidden'}`}>
                                <AiOutlineEdit size={20} className='m-[5px] transition-all hover:text-task-ss-white-500' />
    
                                <span onClick={(e) => handleDeleteTask(e, task.id)}>
                                    <AiOutlineDelete size={20} className='m-[5px] transition-all hover:text-task-ss-white-500'/>
                                </span>
                            </div>
                        </div>
                    )
                }

                
            })}
        </>
    )
}

export default TaskList