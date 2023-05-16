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
        const[subscriptions] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/subscriptions/all`, 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                subscriptions: subscriptions.data.data
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { subscriptions: null }  }
    }
}

const Subscriptions = ({ subscriptions }) => {
    console.log(subscriptions)
    return (
        <>
            <Head>
                <title>Subscriptions: Task SS</title>
            </Head>

            <TitleHeader title='Subscriptions' />

            <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-md">
                <thead className="text-xs">
                    <tr className="border-b border-task-ss-white-300">
                        <th className="px-6 py-5 text-left">ID</th>
                        <th className="px-6 py-5 text-left">USER ID</th>
                        <th className="px-6 py-5 text-left">SUB TYPE</th>
                        <th className="px-6 py-5 text-left">SUB FEE</th>
                        <th className="px-6 py-5 text-left">INTERVAL</th>
                        <th className="px-6 py-5 text-left">STATUS</th>
                        <th className="px-6 py-5 text-left">END DATE</th>
                    </tr>
                </thead>
                <tbody className='text-xs'>
                    {subscriptions.map((item, idx) => {
                        return(
                            <tr 
                                key={idx.toString()}
                                className={`${idx % 2 == 0 ? 'bg-task-ss-white-200 bg-opacity-50' : '' } border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                            >
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">{item.user_id}</td>
                                <td className="px-6 py-4">{capFirst(item.subscription_type.sub_type_name)}</td>
                                <td className="px-6 py-4">₱{item.subscription_type.sub_fee_price}</td>
                                <td className="px-6 py-4">{capFirst(item.subscription_type.interval)}</td>
                                <td className={`px-6 py-4 ${subStyles.status[item.status].text  }`}>{capFirst(item.status)}</td>
                                <td className="px-6 py-4">{moment(item.end_date).format('MMMM DD, YYYY')}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}
 
export default Subscriptions

Subscriptions.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  