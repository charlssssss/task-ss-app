import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'
import { useState } from 'react'

const TaskManager = () => {
    // get user token
    const { data: session, status } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }

    const [sortBy, setSortBy] = useState('created_at')
    const [taskStatus, setTaskStatus] = useState('completed')
    const [orderBy, setOrderBy] = useState('desc')
    const [taskType, setTaskType] = useState('all')
    
    if (status === "loading") return <Loading />
    return (
        <>
            <Head>
                <title>Inbox: Task SS</title>
            </Head>

            <TitleHeader 
                title='Task Manager' 
                sortBy={sortBy}
                setSortBy={setSortBy} 
                orderBy={orderBy}
                setOrderBy={setOrderBy} 
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
                taskType={taskType}
                setTaskType={setTaskType}
            />

            <TaskList 
                api={taskType == 'all' ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter/${sortBy}/${orderBy}` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter/${sortBy}/${orderBy}?task_type_id=${taskType}`} 
                token={userToken} 
                url='taskmanager'
                status={taskStatus}
                showCategory={true}
            />
        </>
    )
}
 
export default TaskManager