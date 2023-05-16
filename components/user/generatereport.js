import axios from 'axios'
import { RegularButton } from "./buttons"
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { FailedToLoad, Loading } from './errors'
import useSWR from 'swr'
import { fetcher } from '../functions'

const GenerateReport = ({ isGenRepClosed, genRepCloseHandler }) => {
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const [filterData, setFilterData] = useState({
        priority: "P1",
    })

    const handleExportCSV =  (e) => {
        e.preventDefault()
        axios(filterData.priority == 'All' ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/exporttasks` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/exporttasks/${filterData.priority}`, { 
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + userToken }
        }).then((data) => {
            const blobUrl = URL.createObjectURL(new Blob([data.data]));
            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = "reports.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        })
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target

        setFilterData(prev => {
            return {...prev, [name]: value }
        })
    }

    console.log(filterData)

    // clear input fields
    const clearHandler = () => {
        genRepCloseHandler()
        setFilterData({
            priority: "P1",
        })
    }
    
    return (
        <div 
            className={`justify-center items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 z-20 ${isGenRepClosed ? ' hidden ' : ' flex '}`} 
        >
            <div className='bg-task-ss-white-100 w-[90%] sm:w-[800px] rounded-lg relative z-20'>
                {/* add category form */}
                <form method='POST'
                >
                    <div>
                        <div className='flex items-center py-3 px-5'>
                            <h2 className='font-semibold text-lg'>Generate Report</h2>
                        </div>
                        <hr className='text-task-ss-white-300'/>
                    </div>

                    {/* input fields */}
                    <div className='my-4 mx-5'>
                        <div className='flex items-center gap-4 text-sm mb-5'>
                            <label htmlFor='priority' className='font-bold'>Priority Level: </label>
                            <select 
                                id='priority' 
                                name='priority' 
                                className='border border-task-ss-white-300 rounded-md py-2' 
                                value={filterData.priority}
                                onChange={e => onChangeHandler(e)}
                            >
                                <option value='P1'>High Priority</option>
                                <option value='P2'>Medium Priority</option>
                                <option value='P3'>Low Priority</option>
                                <option value='P4'>No Priority</option>
                                <option value='All'>All</option>
                            </select>
                        </div>
                        <p className='text-sm font-bold'>Preview:</p>

                        <TaskTable priority={filterData.priority} />
                    </div>
                    
                    {/* cancel and add button */}
                    <div>
                        <hr className='text-task-ss-white-300'/>
                        <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                            <RegularButton 
                                type='snd' 
                                title='Cancel' 
                                m='mr-2' event={clearHandler}
                                eventType='button'
                            />
                            <RegularButton 
                                type='pmry' 
                                title='Download CSV'
                                event={handleExportCSV}
                            />
                        </div>
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


const TaskTable = ({ priority }) => {
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data:tasks, error, isLoading } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks`, userToken], fetcher)
    
    const filterTasks = tasks?.data?.filter(task => priority == 'All' ? task.priority != 'All' : task.priority == priority)
    console.log(filterTasks)

    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    return (
        <div className='h-[300px] overflow-auto'>
            <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-lg">
                <thead className="text-xs">
                    <tr className="border-b border-task-ss-white-300">
                        <th className="px-6 py-5 text-left">ID</th>
                        <th className="px-6 py-5 text-left">CATEGORY ID</th>
                        <th className="px-6 py-5 text-left">TASK TYPE ID</th>
                        <th className="px-6 py-5 text-left">TASK NAME</th>
                        <th className="px-6 py-5 text-left">TASK DESCRIPTION</th>
                        <th className="px-6 py-5 text-left">STATUS</th>
                        <th className="px-6 py-5 text-left">PRIOITY</th>
                        <th className="px-6 py-5 text-left">START DATE</th>
                        <th className="px-6 py-5 text-left">END DATE</th>
                        <th className="px-6 py-5 text-left">START TIME</th>
                        <th className="px-6 py-5 text-left">END TIME</th>
                        <th className="px-6 py-5 text-left">REPEAT TYPE</th>
                    </tr>
                </thead>
                <tbody className='text-xs'>
                {filterTasks.map((task, idx) => (
                    <tr 
                        key={idx.toString()}
                        className={`${idx % 2 == 0 ? 'bg-task-ss-white-200 bg-opacity-50' : '' } border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                    >
                        <td className="px-6 py-4">{task.id}</td>
                        <td className="px-6 py-4">{task.category_id}</td>
                        <td className="px-6 py-4">{task.task_type_id}</td>
                        <td className="px-6 py-4">{task.task_name}</td>
                        <td className="px-6 py-4">{task.task_desc}</td>
                        <td className="px-6 py-4">{task.status}</td>
                        <td className="px-6 py-4">{task.priority}</td>
                        <td className="px-6 py-4">{task.start_date}</td>
                        <td className="px-6 py-4">{task.end_date}</td>
                        <td className="px-6 py-4">{task.start_time}</td>
                        <td className="px-6 py-4">{task.end_time}</td>
                        <td className="px-6 py-4">{task.repeat_type}</td>
                    </tr>
                    ))}    
            </tbody>
        </table>
        </div>
    )
}
 
export default GenerateReport