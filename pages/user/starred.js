import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'

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

            <TaskList 
                api={'http://localhost:8000/api/user/tasks/starred'} 
                token={userToken}
                url='starred'
            />
        </>
    )
}
 
export default Starred