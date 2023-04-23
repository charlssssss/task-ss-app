import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { BsCheck, BsFillCircleFill } from 'react-icons/bs'
import moment from 'moment'
import { handleDeleteTask, truncate } from '../../components/functions'
import { AiFillStar, AiOutlineDelete, AiOutlineCalendar } from 'react-icons/ai'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'
import { useRouter } from 'next/router'
import { Empty2 } from '../../components/user/errors'

const priorityStyles = {
    'P1' : { 
        style:' border-2 bg-priority-high-100 border-priority-high-200 text-priority-high-200 ',
        unStyle:' border-2 bg-priority-high-200 border-priority-high-200 text-task-ss-white-100 '
    },
    'P2' : { 
        style:' border-2 bg-priority-med-100 border-priority-med-200 text-priority-med-200 ',
        unStyle:' border-2 bg-priority-med-200 border-priority-med-200 text-task-ss-white-100 ',
    },
    'P3' : { 
        style:' border-2 bg-priority-low-100 border-priority-low-200 text-priority-low-200 ',
        unStyle:' border-2 bg-priority-low-200 border-priority-low-200 text-task-ss-white-100 ',
    },
    'P4' : { 
        style:' border bg-priority-default-100 border-priority-default-200 text-priority-default-200 ',
        unStyle:' border bg-priority-default-200 border-priority-default-200 text-task-ss-white-100 ',
    } 
}

// fetching all categories and single category
export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    const { data } = await axios.get('http://127.0.0.1:8000/api/user/tasks/filter?status=completed', 
        { headers: { 'Authorization': 'Bearer ' + res.user.token } })

    if(!data) {
        return { notFound: true }
    } 
    return { props: { completed: data.data, token: res.user.token, user: res.user } }
}

const Completed = ({ completed, token, user }) => {
    // console.log(user)
    const router = useRouter()

    // front end variables
    const [hover, setHover] = useState(false)
    const [hoverCheckBtn, setHoverCheckBtn] = useState(false)
    const [current, setCurrent] = useState('')

    const handleUndoTask =  async (e, task) => {
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
                "status"    : "pending",
                "priority"  : task.priority
            }),
        })
        .then(res => {
            if(res.data.success) {
                alert('Task status successfully updated to "Pending".')
                router.push('/user/completed')
            } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error)
            const errorMsg = JSON.parse(error.request?.response)
            alert(errorMsg.errors)
        })
    }

    return (
        <>
            <Head>
                <title>Completed Tasks: Task SS</title>
            </Head>

            <TitleHeader title='Completed Tasks' />

            {completed.length > 0 ?
                completed.map(task => {
                    const completedTime = moment(`${task.updated_at}`).calendar({
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay: '[Yesterday]',
                        lastWeek: '[Last] dddd',
                        sameElse: 'MMM D'
                    })

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
                                        <div className={`rounded-full w-5 h-5 flex justify-center items-center transition-all ${hoverCheckBtn && current == task.id ? priorityStyles[task.priority].style : priorityStyles[task.priority].unStyle }`}
                                            onClick={(e) => handleUndoTask(e, task)}
                                        >
                                            <BsCheck />
                                        </div>
                                    </button>
                                    <div className='flex flex-col w-full'>
                                        {/* task info */}
                                        <div className='flex justify-between h-8'>
                                            <div className='flex items-center'>
                                                {task.is_starred == 1 ? <AiFillStar className='text-task-ss-yellow pr-[5px]' size={20}/> : null}
                                                <p className='text-md line-through'>{truncate(task.task_name, 70)}</p>
                                            </div>
                                            {/* delete part */}
                                            <div className={`flex items-center text-task-ss-white-400 ${(hover &&  current == task.id) ? '' : 'hidden'}`}>
                                                <span onClick={(e) => handleDeleteTask(e, task.id, token, '/user/completed', router)}>
                                                    <AiOutlineDelete size={20} className='ml-[5px] transition-all hover:text-task-ss-white-500'/>
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex flex-wrap justify-between items-center text-[11px] text-task-ss-white-400'>
                                            <div className='flex flex-wrap'>
                                                {/* start date */}
                                                <div className='flex flex-wrap text-task-ss-green-200 mr-4'>
                                                    <AiOutlineCalendar size={12} />
                                                    <p className='px-[5px]'>Completed on {completedTime}</p>
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
                })
            :
                <Empty2 user={user.firstname} title='completed tasks' img='/illustration_3.png' />
            }
        </>
    )
}
 
export default Completed