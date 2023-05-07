import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'
import { useState } from 'react'

const Inbox = () => {
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
                <title>Inbox: Task SS</title>
            </Head>

            <TitleHeader 
                title='Inbox' 
                sortBy={sortBy}
                setSortBy={setSortBy} 
                orderBy={orderBy}
                setOrderBy={setOrderBy} 
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
            />

            <TaskList 
                api={`http://localhost:8000/api/user/tasks/sortfilter/${sortBy}/${orderBy}`} 
                token={userToken} 
                url='inbox'
                status={taskStatus}
                showCategory={true}
            />
        </>
    )
}
 
export default Inbox