import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { BsEnvelope, BsEnvelopeOpen, BsFillCircleFill, BsTrash } from 'react-icons/bs'
import moment from 'moment'
import { truncate } from '../../components/functions'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'
import { useRouter } from 'next/router'

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

const Notifications = ({ completed, token, user }) => {
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
                <title>Notifications: Task SS</title>
            </Head>

            <TitleHeader title='Notifications' />
            
            <div className='flex flex-col bg-task-ss-white-100 rounded-xl drop-shadow-md '>
                <div className='flex flex-col'>
                    <div className='flex justify-between py-5 px-6 bg-task-ss-white-100 hover:drop-shadow-md'>
                        <div className='flex items-center gap-5'>
                            <BsFillCircleFill className='text-task-ss-dark-blue-200' size={30} />

                            <div className='flex gap-3 items-center'>
                                <h2 className='font-medium text-md'>Sample Notification Name</h2>
                                <p className='text-sm font-light'>{truncate('Sample notifaction description', 20)}</p>
                            </div>

                        </div>
                        
                        <div className='flex gap-5'>
                            <button>
                                <BsEnvelopeOpen size={20} />
                            </button>                    
                            <button>
                                <BsTrash size={20} />
                            </button>                    
                        </div>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                </div>
                <div className='flex flex-col'>
                    <div className='flex justify-between py-5 px-6 bg-task-ss-white-200 hover:drop-shadow-md'>
                        <div className='flex items-center gap-5'>
                            <BsFillCircleFill className='text-task-ss-dark-blue-200' size={30} />

                            <div className='flex gap-3 items-center'>
                                <h2 className='text-md'>Sample Notification Name</h2>
                                <p className='text-sm font-light'>{truncate('Sample notifaction description', 20)}</p>
                            </div>

                        </div>
                        
                        <div className='flex gap-5'>
                            <button>
                                <BsEnvelope size={20} />
                            </button>                    
                            <button>
                                <BsTrash size={20} />
                            </button>                    
                        </div>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                </div>
                <div className='flex flex-col'>
                    <div className='flex justify-between py-5 px-6 bg-task-ss-white-200 hover:drop-shadow-md'>
                        <div className='flex items-center gap-5'>
                            <BsFillCircleFill className='text-task-ss-dark-blue-200' size={30} />

                            <div className='flex gap-3 items-center'>
                                <h2 className='text-md'>Sample Notification Name</h2>
                                <p className='text-sm font-light'>{truncate('Sample notifaction description', 20)}</p>
                            </div>

                        </div>
                        
                        <div className='flex gap-5'>
                            <button>
                                <BsEnvelope size={20} />
                            </button>                    
                            <button>
                                <BsTrash size={20} />
                            </button>                    
                        </div>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                </div>
            </div>
        </>
    )
}
 
export default Notifications