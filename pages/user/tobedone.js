import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'

const Tobedone = () => {
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
                <title>To Be Done: Task SS</title>
            </Head>

            <TitleHeader title='To Be Done' />

            <TaskList 
                api={'http://localhost:8000/api/user/tasks/type/2'} 
                token={userToken} 
                url='tobedone'
            />
        </>
    )
}
 
export default Tobedone