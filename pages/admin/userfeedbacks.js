import Head from 'next/head'
import TitleHeader from '../../components/admin/titleheader'
import AdminLayout from '../../layouts/adminLayout'
import TableList from '../../components/admin/tablelist'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { capFirst } from '../../components/functions'
import moment from 'moment'

const subStyles = {
    status: {
        'expired': { text : 'text-task-ss-red-200' },
        'active': { text : 'text-task-ss-green-200' },
    }
}

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[feedbacks] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/feedbacks/all'),
        ])
        return { 
            props: { 
                feedbacks: feedbacks.data.data.data
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { feedbacks: null }  }
    }
}

const UserFeedbacks = ({ feedbacks }) => {
    console.log(feedbacks)
    return (
        <>
            <Head>
                <title>User Feedbacks: Task SS</title>
            </Head>

            <TitleHeader title='User Feedbacks' />

            <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-md">
                <thead className="text-xs">
                    <tr className="border-b border-task-ss-white-300">
                        <th className="px-6 py-5 text-left">ID</th>
                        <th className="px-6 py-5 text-left">USER ID</th>
                        <th className="px-6 py-5 text-left">COMMENTS</th>
                        <th className="px-6 py-5 text-left">RATINGS</th>
                        <th className="px-6 py-5 text-left">CREATED AT</th>
                    </tr>
                </thead>
                <tbody className='text-xs'>
                    {feedbacks.map((item, idx) => {
                        return(
                            <tr 
                                key={idx.toString()}
                                className={`${idx % 2 == 0 ? 'bg-task-ss-white-200 bg-opacity-50' : '' } border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                            >
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">{item.user_id}</td>
                                <td className="px-6 py-4">{item.comments}</td>
                                <td className="px-6 py-4">{item.ratings}</td>
                                <td className="px-6 py-4">{moment(item.created_at).format('MMMM DD, YYYY')}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
 
export default UserFeedbacks

UserFeedbacks.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  