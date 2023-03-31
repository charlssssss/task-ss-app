import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'

const Inbox = () => {
    // get user token
    const { data: session, status } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }
    
    if (status === "loading") return <Loading />
    return (
        <>
            <Head>
                <title>Inbox: Task SS</title>
            </Head>

            <TitleHeader title='Inbox' />

            <TaskList 
                api={'http://localhost:8000/api/user/tasks/created_at/desc'} 
                token={userToken} 
                url='inbox'
            />
        </>
    )
}
 
export default Inbox