import { RegularButton } from "./buttons"
import { useState } from "react"
import GenerateReport from "./generatereport"

// components for title header, (for consistent layout)
const TitleHeader = ({ title, sortBy, setSortBy, orderBy, setOrderBy, taskStatus, setTaskStatus, taskType, setTaskType, generateReport }) => {

    const [isGenRepClosed, setIsGenRepClosed] = useState(true)
    const genRepCloseHandler = () => setIsGenRepClosed(!isGenRepClosed)
    
    return (
        <>
            <div className='flex flex-wrap justify-between items-center border-b border-b-task-ss-white-300 pb-4 mb-4'>
                <h3 className='text-2xl font-medium'>{title}</h3>

                {(sortBy && orderBy && taskStatus) && 
                    <div className='flex flex-wrap ml-auto justify-end text-sm'>

                        {taskType &&
                            <select 
                                className='rounded-md py-2 ml-3 mt-2'
                                value={taskType}
                                onChange={e => setTaskType(e.target.value)}
                            >
                                <option value='1'>To Do List</option>
                                <option value='2'>To Be Done</option>
                                <option value='all'>All</option>
                            </select>
                        }

                        <select 
                            className='rounded-md py-2 ml-3 mt-2'
                            value={taskStatus}
                            onChange={e => setTaskStatus(e.target.value)}
                        >
                            <option value='pending'>Pending</option>
                            <option value='overdue'>Overdue</option>
                            <option value='completed'>All</option>
                        </select>

                        <select 
                            className='rounded-md py-2 ml-3 mt-2'
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value='task_name'>Name</option>
                            <option value='start_date'>Start date</option>
                            <option value='end_date'>End date</option>
                            <option value='created_at'>Date added</option>
                            <option value='priority'>Priority</option>
                            <option value='status'>Status</option>
                            <option value='category_id'>Category</option>
                        </select>

                        <select 
                            className='rounded-md py-1 ml-3 mt-2'
                            value={orderBy}
                            onChange={e => setOrderBy(e.target.value)}
                        >
                            <option value='asc'>Asc.</option>
                            <option value='desc'>Desc.</option>
                        </select>
                    </div>
                }

                {generateReport &&
                    <RegularButton
                        type='pmry'
                        title='Generate Report'
                        event={genRepCloseHandler}
                    />
                }
            </div>
            <GenerateReport
                isGenRepClosed={isGenRepClosed}
                genRepCloseHandler={genRepCloseHandler}
            />
        </>
    )
}
 
export default TitleHeader