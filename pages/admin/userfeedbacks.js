import Head from 'next/head'
import TitleHeader from '../../components/admin/titleheader'
import AdminLayout from '../../layouts/adminLayout'
import TableList from '../../components/admin/tablelist'
import { getSession } from 'next-auth/react'
import axios from 'axios'
import { capFirst } from '../../components/functions'
import moment from 'moment'
import { AiFillDelete } from 'react-icons/ai'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[feedbacks] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/feedbacks/all'),
        ])
        return { 
            props: { 
                feedbacks: feedbacks.data.data.data,
                token: res.user.token
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { feedbacks: null, token: null }  }
    }
}

const UserFeedbacks = ({ feedbacks, token }) => {
    const router = useRouter()
    
    const handleDeleteFeedback =  async (e, id) => {
        if(confirm(`Are you sure u want to delete feedback no.${id}?`) ) {
            e.preventDefault()
            await axios(`http://127.0.0.1:8000/api/user/feedbacks/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => {
                if(res.data.success) {
                    alert(res.data.message)
                    router.push('/admin/userfeedbacks')
                } else { alert(res.data.message) }
            })
            .catch(error => {
                console.log(error)
                alert(error)
            })
        }
    }

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
                        <th className="px-6 py-5 text-left">FULL NAME</th>
                        <th className="px-6 py-5 text-left">COMMENTS</th>
                        <th className="px-6 py-5 text-left">RATINGS</th>
                        <th className="px-6 py-5 text-left">CREATED AT</th>
                        <th className="px-6 py-5 text-left">ACTION</th>
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
                                <td className="px-6 py-4">{`${item.user.firstname} ${item.user.lastname}`}</td>
                                <td className="px-6 py-4">{item.comments}</td>
                                <td className="px-6 py-4">{item.ratings}</td>
                                <td className="px-6 py-4">{moment(item.created_at).format('MMMM DD, YYYY')}</td>
                                <td className="px-6 py-4">
                                    <AiFillDelete 
                                        className='text-task-ss-red-200 transition-all hover:opacity-75'
                                        size={20}
                                        onClick={(e) => handleDeleteFeedback(e, item.id)}
                                    />
                                </td>
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
  