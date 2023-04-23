import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'

const Todolist = () => {
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
                <title>To Do List: Task SS</title>
            </Head>

            <TitleHeader title='To Do List' />

            <TaskList 
                api={'http://localhost:8000/api/user/tasks/sortfilter/created_at/desc?task_type_id=1'} 
                token={userToken} 
                url='todolist'
                showCategory={true}
            />
        </>
    )
}
 
export default Todolist