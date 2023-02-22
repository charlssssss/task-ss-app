import Axios from 'axios'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import TaskList from '../../../../components/tasklist'
import TitleHeader from '../../../../components/titleheader'

// fetching all categories and single category
export const getServerSideProps = async (context) => {
    const id = context.params.categoryId
    const res = await getSession(context)
    const { data } = await Axios.get(`http://localhost:8000/api/user/categories/${id}`, 
        { headers: { 'Authorization': 'Bearer ' + res.user.token } })

    if(!data) {
        return { notFound: true }
    } 
    return { props: { category: data.data, userToken: res.user.token } }

    // try {
        // const res = await fetch(`http://localhost:8000/api/categories/${id}`)
        // const data = await res.json()
        // return { props: { category: data.data } }


        // fetching multiple data
        // const [ categoryRes, tasksRes ] = await Promise.all([
        //     fetch(`http://localhost:8000/api/categories/${id}`),
        //     fetch(`http://localhost:8000/api/tasks/all/${id}`)
        // ])
        // const [ category, tasks ] = await Promise.all([
        //     categoryRes.json(),
        //     tasksRes.json()
        // ])

        // return { props: { category: category.data, tasks: tasks.data } }
    // }
    // catch {
    //     return { notFound: true }
    // }
}

// category detail layout
const CategoryDetail = ({ category, userToken }) => {
    return (
        <>
            <Head>
                <title>{`${category.category_name} : Task SS`}</title>
            </Head>

            <TitleHeader title={category.category_name} />

            {/* user's list of tasks section */}
            <TaskList api={`http://localhost:8000/api/user/tasks/all/${category.id}`} token={userToken}/>
        </>
    )
}
 
export default CategoryDetail