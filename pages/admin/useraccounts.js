import Head from 'next/head'
import TitleHeader from '../../components/admin/titleheader'
import AdminLayout from '../../layouts/adminLayout'
import TableList from '../../components/admin/tablelist'
import { getSession } from 'next-auth/react'
import axios from 'axios'

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[users] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/user/users', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                users: users.data.data.filter(item => item.role_id == '1')
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { users: null }  }
    }
}

const UserAccount = ({ users }) => {
    return (
        <>
            <Head>
                <title>User Accounts: Task SS</title>
            </Head>

            <TitleHeader title='User Accounts' />

            {/* <TableList
                api='http://127.0.0.1:8000/api/user/users'
                sort='1'
            /> */}
            <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-md">
                <thead className="text-xs">
                    <tr className="border-b border-task-ss-white-300">
                        <th className="px-6 py-5 text-left">ID</th>
                        <th className="px-6 py-5 text-left">FIRST NAME</th>
                        <th className="px-6 py-5 text-left">LAST NAME</th>
                        <th className="px-6 py-5 text-left">EMAIL ADDRESS</th>
                        <th className="px-6 py-5 text-left">PHONE NUMBER</th>
                    </tr>
                </thead>
                <tbody className='text-xs'>
                    {users.map((item, idx) => {
                        return(
                            <tr 
                                key={idx.toString()}
                                className={`${idx % 2 == 0 ? 'bg-task-ss-white-200 bg-opacity-50' : '' } border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                            >
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">{item.firstname}</td>
                                <td className="px-6 py-4">{item.lastname}</td>
                                <td className="px-6 py-4">{item.email}</td>
                                <td className="px-6 py-4">{item.phone}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </>
    )
}
 
export default UserAccount

UserAccount.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  