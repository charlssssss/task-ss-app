import useSWR, { mutate } from 'swr'
import axios from 'axios'
import moment from 'moment'
import { useRouter } from 'next/router'
import { fetcher } from '../functions'
import { BsCircleFill } from 'react-icons/bs'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { FailedToLoad, Loading } from './errors'
import { useSession } from 'next-auth/react'
import EditFeedback from './editfeedback'
import { useState } from 'react'

// component for task list
const FeedbackList = ({ api, token, url }) => {
    const router = useRouter()

    const { data: session } = useSession()

    // fetch data
    const { data, error, isLoading } = useSWR([api, token], fetcher)

    const [isFeedbackMdlClosed, setIsFeedbackMdlClosed] = useState(true)
    const feedbackMdlCloseHandler = () => setIsFeedbackMdlClosed(!isFeedbackMdlClosed)

    const[editFeedback, setEditFeedback] = useState({})

    // complete task function
    const handleDeleteFeedback =  async (e, id) => {
        if(confirm(`Are you sure u want to delete feedback no.${id}?`) ) {
            e.preventDefault()
            await axios(`http://127.0.0.1:8000/api/user/feedbacks/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => {
                if(res.data.success) {
                    mutate('http://127.0.0.1:8000/api/user/feedbacks')
                    alert(res.data.message)
                    router.push(url)
                } else { alert(res.data.message) }
            })
            .catch(error => {
                console.log(error)
                const errorMsg = JSON.parse(error.request?.response)
                alert(errorMsg.errors)
            })
        }
    }

    const handleEditFeedback =  async (e, task) => {
        e.preventDefault()
        await axios(`http://127.0.0.1:8000/api/user/tasks/${task.id}`, { 
            method: 'DELETE',
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
                mutate('http://127.0.0.1:8000/api/user/tasks')
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

    console.log(session)
    return (
        <>
            {data.data.data.map((feedback, idx) => (
                <div className='flex flex-col py-5 px-8 bg-task-ss-white-100 rounded-xl mb-5'
                    key={idx.toString()}
                >
                    <div className='flex justify-between'>
                        <div className='flex items-start'>
                            <BsCircleFill className='text-task-ss-dark-blue-200 mr-5' size={60}  />
                            <div className='flex flex-col'>
                                <h3 className='mb-2 font-medium'>Sample Hoy</h3>
                                <p className='text-sm'>{moment(feedback.updated_at).format('MMMM DD, YYYY')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col justify-end'>
                            <p>Rating: {feedback.ratings}</p>

                            <div className='flex items-center justify-end mt-2'>
                                <span onClick={() => {
                                        setEditFeedback(feedback)
                                        feedbackMdlCloseHandler()
                                    }}
                                >
                                    <AiOutlineEdit size={20} className='mr-2 text-task-ss-white-400 hover:cursor-pointer' />
                                </span>

                                <span onClick={e => {
                                    handleDeleteFeedback(e, feedback.id)
                                }}>
                                    <AiOutlineDelete size={20} className='text-task-ss-white-400 hover:cursor-pointer' />
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <p className='pt-4'>{feedback.comments}</p>
                </div>
            ))}

            <EditFeedback
                isFeedbackMdlClosed={isFeedbackMdlClosed}
                feedbackMdlCloseHandler={feedbackMdlCloseHandler}
                editFeedback={editFeedback}
            />
        </>
    )
}

const FeedbackRow = ({ username, date, rating, comment, edit_func, delete_func, id }) => {
    return(
        <>
            <div className='flex flex-col py-5 px-8 bg-task-ss-white-100 rounded-xl mb-5'>
                <div className='flex justify-between'>
                    <div className='flex items-start'>
                        <BsCircleFill className='text-task-ss-dark-blue-200 mr-5' size={60}  />
                        <div className='flex flex-col'>
                            <h3 className='mb-2 font-medium'>{username}</h3>
                            <p className='text-sm'>{moment(date).format('MMMM DD, YYYY')}</p>
                        </div>
                    </div>

                    <div className='flex flex-col justify-end'>
                        <p>Rating: {rating}</p>

                        <div className='flex items-center justify-end mt-2'>
                            <span onClick={edit_func(id)}>
                                <AiOutlineEdit size={20} className='mr-2 text-task-ss-white-400 hover:cursor-pointer' />
                            </span>

                            <span onClick={e => {
                                delete_func(e, id)
                            }}>
                                <AiOutlineDelete size={20} className='text-task-ss-white-400 hover:cursor-pointer' />
                            </span>
                        </div>
                    </div>
                </div>
                
                <p className='pt-4'>{comment}</p>
            </div>
        </>
    )
}

export default FeedbackList