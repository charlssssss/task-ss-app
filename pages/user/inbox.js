import Head from 'next/head'
import TaskList from '../../components/tasklist'
import TitleHeader from '../../components/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/errors'

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

            <TaskList api={'http://localhost:8000/api/user/tasks'} token={userToken} />
        </>
    )
}
 
export default Inbox