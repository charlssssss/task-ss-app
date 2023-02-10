import Head from 'next/head'
import TaskList from '../../components/tasklist'
import TitleHeader from '../../components/titleheader'

const Inbox = () => {
    return (
        <>
            <Head>
                <title>Inbox: Task SS</title>
            </Head>

            <TitleHeader title='Inbox' />

            <TaskList api={`http://localhost:8000/api/tasks`} />
        </>
    )
}
 
export default Inbox