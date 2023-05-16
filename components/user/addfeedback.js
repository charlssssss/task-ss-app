import axios from 'axios'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { AiFillFlag, AiFillStar } from 'react-icons/ai'
import { RegularInput, RegularTextArea } from "./inputs"
import { RegularButton, TaskDateTimeButton, TaskDateTimeButton2, TaskIconButton } from "./buttons"
import { fetcher, truncate } from '../functions'


const AddFeedback = ({ isFeedbackMdlClosed, feedbackMdlCloseHandler }) => {
    const router = useRouter()
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const [comments, setComments] = useState('')
    const [ratings, setRatings] = useState('1')


    // clear all input fields
    const clearHandler = () => {
        feedbackMdlCloseHandler()
        setComments('')
        setRatings('1')

    }

    const handleAddFeedback = async (e) => {
        e.preventDefault()
    
        await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/feedbacks`, { 
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ 
                "comments"  : comments,
                "ratings" : ratings,
            }),
        })
        .then(res => {
            if(res.data.success) {
                clearHandler()
                router.push(`/feedback`)
                alert(res.data.message)
            } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div 
            className={` items-center absolute top-0 left-0 w-screen h-screen z-20 bg-task-ss-dark-blue-600 bg-opacity-50 ${isFeedbackMdlClosed ? ' hidden ' : ' flex flex-col'}`} 
        >   
                <div className='bg-task-ss-white-100 w-[90%] md:w-[600px] h-auto rounded-lg mt-[5%] relative z-20'>
                    {/* add task form */}
                    <form method='POST' onSubmit={handleAddFeedback}>
                        <div className='flex flex-wrap items-center py-3 px-5'>
                            <h2 className='font-semibold text-lg mr-4'>Send Feedback</h2>
                        </div>
                        <hr className='text-task-ss-white-300'/>

                        <div className='pt-2 pb-10 px-5'>
                            <RegularTextArea 
                                name='task_name' 
                                title='Comments' m='mb-6' 
                                placeholder='Please enter your comments here...'
                                value={comments} change={setComments} 
                            />
                            
                            <select 
                                value={ratings} 
                                onChange={(e) => setRatings(e.target.value)}
                                className='rounded-lg py-3 pr-8 text-xs border transition-all border-task-ss-white-300 w-full md:w-auto active:scale-[0.98]'
                            >
                                <option value='1'>1 Star</option>
                                <option value='2'>2 Stars</option>
                                <option value='3'>3 Stars</option>
                                <option value='4'>4 Stars</option>
                                <option value='5'>5 Stars</option>
                            </select>

                        </div>


                        {/* cancel and add task button */}
                        <hr className='text-task-ss-white-300'/>
                        <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                            <RegularButton 
                                type='snd' 
                                title='Cancel' 
                                eventType='button'
                                m='mr-2' event={clearHandler}
                            />
                            <RegularButton 
                                type='pmry' 
                                title='Submit Feedback'
                                eventType='submit'
                            />
                        </div>

                    </form>
                </div>

            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={clearHandler}
            ></div>
        </div>
    )
}
 
export default AddFeedback