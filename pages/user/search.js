import Head from 'next/head'
import { useSession } from 'next-auth/react'
import TaskList from '../../components/user/tasklist'
import TitleHeader from '../../components/user/titleheader'
import { Loading } from '../../components/user/errors'
import { useRouter } from 'next/router'
import { RegularInput } from '../../components/user/inputs'
import { useState } from 'react'
import { RegularButton } from '../../components/user/buttons'

const Search = () => {
    const router = useRouter()
    const { q } = router.query

    const [query, setQuery] = useState('')
    
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
                <title>Search: Task SS</title>
            </Head>

            {q != undefined && (q != '' && <TitleHeader title={`Search results for "${q}"`} />)}

            <form onSubmit={(e) => {
                e.preventDefault();
                router.push('/user/search?q=' + query.trim())
            }} 
                className='flex flex-wrap md:flex-nowrap w-full'
            >
                <div className='w-full md:mr-5 md:w-[95%]'>
                    <RegularInput
                        value={query} 
                        change={setQuery}
                        placeholder='Search for task name or task description' 
                    />
                </div>
                <div className='ml-auto'>
                    <RegularButton
                        type='pmry'
                        title='Search'
                        m='md:mt-4 mb-2'
                        eventType='submit'
                        disabled={query == ''}
                    />
                </div>
            </form>

            {q != undefined && (q != '' && 
            <TaskList 
                api={`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter?task_name=${q}&task_desc=${q}`} 
                token={userToken} 
                url={`search?q=${q}`}
                showCategory={true}
            />)}
        </>
    )
}
 
export default Search