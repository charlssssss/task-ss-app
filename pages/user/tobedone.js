import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'
import { useState } from 'react'

const Tobedone = () => {
    // get user token
    const { data: session, status } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }

    const [sortBy, setSortBy] = useState('created_at')
    const [taskStatus, setTaskStatus] = useState('completed')
    const [orderBy, setOrderBy] = useState('desc')
    
    if (status === "loading") return <Loading />
    return (
        <>
            <Head>
                <title>To Be Done: Task SS</title>
            </Head>

            <TitleHeader 
                title='To Be Done' 
                sortBy={sortBy}
                setSortBy={setSortBy} 
                orderBy={orderBy}
                setOrderBy={setOrderBy} 
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
            />

            <TaskList 
                api={`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter/${sortBy}/${orderBy}?task_type_id=2`} 
                token={userToken} 
                url='tobedone'
                status={taskStatus}
                showCategory={true}
            />
        </>
    )
}
 
export default Tobedone