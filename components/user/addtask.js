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

const AddTask = ({ isTaskMdlClosed, taskMdlCloseHandler, taskType, setTaskType }) => {
    const router = useRouter()
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data:categories } = useSWR(['http://localhost:8000/api/user/categories', userToken], fetcher)

    // add task variables
    const [taskCategory, setTaskCategory] = useState('')
    if(router.query.categoryId) {
        useEffect(()=> { setTaskCategory(router.query.categoryId) }, [router.query.categoryId])
    }
    else {
        useEffect(()=> { setTaskCategory(categories?.data[0]?.id) }, [categories])
    }

    console.log(taskCategory)

    const [taskName, setTaskName] = useState('')
    const [taskDesc, setTaskDesc] = useState('')
    const [isStarred, setIsStarred] = useState(0)
    const [priority, setPriority] = useState('P4')
    const [status, setStatus] = useState('pending')

    // const today = new Date().toLocaleDateString('en-US')
    // today.setDate(today.getDate() + 3) 
    // const currDate = moment(new Date().toLocaleDateString()).format('YYYY-MM-DD')

    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    const currDate = `${year}-${month}-${day}`

    const currTime = new Date(Date.now() + 5 * 60000).toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Manila', 
        hour12: false, 
        hour: 'numeric', 
        minute: 'numeric'
    })
    
    const [startDate, setStartDate] = useState(currDate)
    const [startTime, setStartTime] = useState(currTime)
    const [startClose, setStartClose] = useState(true)
    const startCloseHandler = () => setStartClose(!startClose)
    
    const [endDate, setEndDate] = useState(currDate)
    const [endTime, setEndTime] = useState('23:59:00')
    const [endClose, setEndClose] = useState(true)
    const endCloseHandler = () => setEndClose(!endClose)

    const [priorClose, setPriorClose] = useState(true)

    // clear all input fields
    const clearHandler = () => {
        taskMdlCloseHandler()
        setTaskCategory(router.query.categoryId)
        setTaskName('')
        setTaskDesc('')
        setIsStarred(0)
        setPriority('P4')
        setStatus('pending')
        setStartDate(currDate)
        setEndDate(currDate)
        setStartTime(currTime)
        setEndTime('23:59:00')
        setPriorClose(true)
        setStartClose(true)
        setEndClose(true)
    }
    // console.log(taskCategory)
    // console.log("info: ", taskType, taskCategory, taskName, taskDesc, isStarred, priority, status)
    // console.log("date time: ", startDate, startTime, endDate, endTime)

    // add task function
    const handleAddTask =  async (e) => {
        e.preventDefault()
        
        await axios('http://127.0.0.1:8000/api/user/tasks', { 
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ 
                "category_id"  : taskCategory,
                "task_type_id" : taskType,
                "task_name"    : taskName,
                "task_desc"    : taskDesc,
                "is_starred"   : isStarred,
                "priority"     : priority,
                "status"       : status,
                "start_date"   : startDate,
                "end_date"     : endDate,
                "start_time"   : startTime,
                "end_time"     : endTime
            }),
        })
        .then(res => {
            if(res.data.success) {
                mutate('http://127.0.0.1:8000/api/user/tasks')
                clearHandler()
                router.push(`/user/categories/${taskCategory}`)
                alert(res.data.message)
            } else { alert(res.data.message) }
        })
        .catch(error => {
            const errorMsg = JSON.parse(error.request.response)
            console.log(errorMsg.errors)
            alert("Failed to Add Task: " + errorMsg.message + "\n")
        })
    }

    // console.log("start time: ", startTime)
    // console.log("end time: ", endTime)
    return (
        <div 
            className={` items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 ${isTaskMdlClosed ? ' hidden ' : ' flex flex-col'}`} 
        >   
            {(categories?.data.length > 0) ? 
                <div className='bg-task-ss-white-100 w-[90%] md:w-[600px] h-auto rounded-lg mt-[5%] relative z-20'>
                    {/* add task form */}
                    <form method='POST' onSubmit={handleAddTask}>
                        <div className='flex flex-wrap items-center py-3 px-5'>
                            <h2 className='font-semibold text-lg mr-4'>Add Task</h2>
                            {/* task type dropdown */}
                            <select 
                                value={taskType}
                                onChange={e => setTaskType(e.target.value)}
                                name='task_type_id'
                                className='font-medium rounded-md bg-task-ss-white-300 text-xs py-2 pr-7'
                            >   
                                <option value='1'>To Do List</option>
                                <option value='2'>To Be Done</option>
                            </select>
                        </div>
                        <hr className='text-task-ss-white-300'/>

                        <div className='pt-2 pb-10 px-5'>
                            {/* add task input fields */}
                            <RegularInput 
                                name='task_name' 
                                title='Task Name' m='mb-6' 
                                placeholder='e.g. Write a essay about your favorite hobby.'
                                value={taskName} change={setTaskName} 
                            />
                            <RegularTextArea 
                                name='task_desc' 
                                title='Task Description' m='mb-4' 
                                placeholder="e.g. You'll need to explain what the hobby is, why you enjoy it..."
                                value={taskDesc} change={setTaskDesc}
                            />


                            {/* task icon buttons (starred, recurring, priority) */}
                            <div className='flex justify-between flex-wrap'>
                                <div className='flex flex-wrap mt-2 w-full md:w-auto'>

                                    {taskType == 2 ?  
                                        <>
                                            <TaskDateTimeButton 
                                                color='text-task-ss-green-200'
                                                title='Start Date' m='md:mr-2' 
                                                dateValue={startDate} 
                                                changeDate={(e) => setStartDate(e.target.value)} 
                                                timeValue={startTime} 
                                                changeTime={(e) => setStartTime(`${e.target.value}:00`)} 
                                                state={startClose}
                                                event={startCloseHandler}
                                            />
                                            <TaskDateTimeButton 
                                                color='text-task-ss-orange'
                                                title='End Date' m='md:mr-2'
                                                dateValue={endDate ?? ''} 
                                                changeDate={(e) => setEndDate(e.target.value)} 
                                                timeValue={endTime ?? ''} 
                                                changeTime={(e) => setEndTime(`${e.target.value}:00`)} 
                                                state={endClose}
                                                event={endCloseHandler}
                                            />
                                        </>
                                    :
                                        <TaskDateTimeButton2
                                            color='text-task-ss-orange'
                                            title='End Date' m='md:mr-2'
                                            dateValue={endDate ?? ''} 
                                            changeDate={(e) => setEndDate(e.target.value)} 
                                            timeValue={endTime ?? ''} 
                                            changeTime={(e) => setEndTime(`${e.target.value}:00`)} 
                                            state={endClose}
                                            event={endCloseHandler}
                                            event2={() => {
                                                setEndDate('')
                                                setEndTime('')
                                            }}
                                        />
                                    }

                                    <select 
                                        value={taskCategory} 
                                        onChange={(e) => setTaskCategory(e.target.value)}
                                        className='rounded-lg py-3 pr-8 text-xs border transition-all border-task-ss-white-300 w-full md:w-auto active:scale-[0.98]'
                                    >
                                        {!categories && <option>Loading...</option>}
                                        {categories?.data?.map((category, idx) => (
                                            <option 
                                                key={idx.toString()}
                                                value={category.id}
                                            >
                                                {truncate(category.category_name, 15)}
                                            </option>
                                        ))}
                                    </select>
                                    
                                </div>

                                {/* starred and priority button*/}
                                <div className='flex flex-wrap mt-5 md:mt-2 ml-auto'>
                                    <TaskIconButton 
                                        event={() => setIsStarred(isStarred == 0 ? 1 : 0)} 
                                        icon={<AiFillStar />} 
                                        m='mr-2' 
                                        current={isStarred} 
                                        styles={{
                                            0: {style:' bg-task-ss-white-100 text-task-ss-white-400 border-task-ss-white-300 '},
                                            1: {style:' bg-task-ss-white-400 text-task-ss-yellow border-task-ss-white-400 '} 
                                        }}
                                    />

                                    <div className='relative'>
                                        <TaskIconButton 
                                            eventType='button' 
                                            event={() => setPriorClose(!priorClose)} 
                                            icon={<AiFillFlag />} 
                                            current={priority} 
                                            styles={{
                                                'P1': {style:' bg-task-ss-red-200 text-task-ss-white-100 border-task-ss-red-200 '},
                                                'P2': {style:' bg-task-ss-yellow text-task-ss-white-100 border-task-ss-yellow '},
                                                'P3': {style:' bg-task-ss-category-200 text-task-ss-white-100 border-task-ss-category-200 '},
                                                'P4': {style:' bg-task-ss-white-100 text-task-ss-white-400 border-task-ss-white-300 '} 
                                            }}
                                        />

                                        <div className={`absolute top-10 right-0 rounded-md z-10 bg-task-ss-white-100 border border-task-ss-white-300 ${priorClose ? 'hidden' : 'block'}`}>
                                            <ul className='w-28'>
                                                {priorityOptions.map((p, index) => (
                                                    <li 
                                                        className='text-xs py-1 px-3 cursor-pointer'
                                                        key={index.toString()}
                                                        onClick={() => {
                                                            setPriority(p.priority)
                                                            setPriorClose(!priorClose)
                                                        }}
                                                    >
                                                        {p.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                title='Add Task'
                                eventType='submit'
                                disabled={taskName == ''}
                            />
                        </div>

                    </form>
                </div>
                :
                <div className='bg-task-ss-white-100 w-[500px] h-auto rounded-lg mt-[5%] relative z-20'>
                    <div className='flex items-center py-3 px-5'>
                        <h2 className='font-semibold text-lg'>Opps...</h2>
                    </div>
                    <hr className='text-task-ss-white-300'/>

                    <div className='py-4 px-5'>
                        <p>Please create at least 1 category before adding tasks.</p>
                        <p>Thank you!</p>
                    </div>

                    <hr className='text-task-ss-white-300'/>
                    <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                        <RegularButton 
                            type='pmry' 
                            title='Okay, I Understand' 
                            eventType='button'
                            m='mr-2' event={clearHandler}
                        />
                    </div>
                </div>
            }

            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={clearHandler}
            ></div>
        </div>
    )
}
 
export default AddTask