import Head from 'next/head'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { useSession } from 'next-auth/react'
import { Loading } from '../../components/user/errors'
import { useState } from 'react'

const Starred = () => {
    // get user token
    const { data: session, status } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }
    
    const [sortBy, setSortBy] = useState('created_at')
    const [orderBy, setOrderBy] = useState('desc')

    if (status === "loading") return <Loading />

    return (
        <>
            <Head>
                <title>Starred: Task SS</title>
            </Head>

            <TitleHeader 
                title='Starred' 
                sortBy={sortBy}
                setSortBy={setSortBy} 
                orderBy={orderBy}
                setOrderBy={setOrderBy}   
            />

            <TaskList 
                api={`http://localhost:8000/api/user/tasks/sortfilter/${sortBy}/${orderBy}?is_starred=1`} 
                token={userToken}
                url='starred'
            />
        </>
    )
}
 
export default Starred