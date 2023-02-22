import Head from 'next/head'
import TaskList from '../../components/tasklist'
import TitleHeader from '../../components/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/errors'

const Starred = () => {
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
                <title>Starred: Task SS</title>
            </Head>

            <TitleHeader title='Starred' />

            <TaskList api={'http://localhost:8000/api/user/tasks/allstarred'} token={userToken}/>
        </>
    )
}
 
export default Starred