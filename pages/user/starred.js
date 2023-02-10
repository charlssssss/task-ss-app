import Head from 'next/head'
import TaskList from '../../components/tasklist'
import TitleHeader from '../../components/titleheader'

const Starred = () => {
    return (
        <>
            <Head>
                <title>Starred: Task SS</title>
            </Head>

            <TitleHeader title='Starred' />

            <TaskList api={`http://localhost:8000/api/tasks/allstarred`} />
        </>
    )
}
 
export default Starred