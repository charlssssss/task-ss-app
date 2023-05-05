import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'
import AdminLayout from '../../layouts/adminLayout'

const BarChartComp = dynamic(() => import('../../components/chart/barchart'), { ssr: false })
const LineChartComp = dynamic(() => import('../../components/chart/linechart'), { ssr: false })

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[recent, upcomingTasks, completedCount, blockedkWebCount, overdueTasks] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter/updated_at/desc', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter/end_date/asc', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter?status=completed', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/blockwebsites/includes', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter?status=overdue', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                recent: recent.data.data, 
                upcomingTasks: upcomingTasks.data.data,
                completedCount: completedCount.data.data.length,
                blockedkWebCount: blockedkWebCount.data.data.length,
                overdueTasks: overdueTasks.data.data,
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { notFound: true }
    }
}

const Reports = ({recent, upcomingTasks, completedCount, blockedkWebCount, overdueTasks }) => {
    const totalTasks = upcomingTasks.filter(task => task.end_date != null)
    
    return (
        <>
            <Head>
                <title>Reports: Task SS</title>
            </Head>

            <TitleHeader title='Reports' />

            <div className='flex flex-wrap justify-between mb-8'>
                {/* left/top panel */}
                <div className='flex flex-col w-full mb-5'>
                    {/*Summaries panel */}
                    <div className='w-full flex flex-wrap gap-3 mb-10'>
                        <SmallCard 
                            title='Total Tasks' 
                            count={totalTasks.length.toString().padStart(2, '0')} 
                            link='/user/inbox' 
                        />
                        <SmallCard 
                            title='Pending Tasks' 
                            count={99} 
                            link='/user/inbox' 
                        />
                        <SmallCard 
                            title='Completed Tasks' 
                            count={completedCount.toString().padStart(2, '0')} 
                            link='/user/completed' 
                        />
                        <SmallCard 
                            title='Overdue Tasks' 
                            count={'99'} 
                            link='/user/inbox' 
                        />
                        <SmallCard 
                            title='Categories' 
                            count={'99'} 
                            link='/user/categories' 
                        />
                        <SmallCard 
                            title='Block Websites' 
                            count={blockedkWebCount.toString().padStart(2, '0')}  
                            event={() => blockMdlCloseHandler()} 
                        />
                    </div>

                    <div className='flex flex-col-reverse xl:flex-row gap-5'>

                        <div className='w-full xl:w-[60%]'>
                            <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-md">
                                <thead className="text-xs">
                                    <tr className="border-b border-task-ss-white-300">
                                        <th className="px-6 py-5 text-left">ID</th>
                                        <th className="px-6 py-5 text-left">CATEGORY NAME</th>
                                        <th className="px-6 py-5 text-left">STATUS</th>
                                        <th className="px-6 py-5 text-left">NO. OF TASKS</th>
                                    </tr>
                                </thead>
                                <tbody className='text-xs'>
                                            <tr 
                                                className={`bg-task-ss-white-200 bg-opacity-50 border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                                            >
                                                <td className="px-6 py-4">0123</td>
                                                <td className="px-6 py-4">Category 1</td>
                                                <td className="px-6 py-4">Completed</td>
                                                <td className="px-6 py-4">312</td>
                                            </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className='w-full xl:w-[40%]'>
                            <div className='flex flex-col gap-5'>
                                <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5'>
                                    <h2 className='font-medium text-xl mb-5'>Title Sample</h2>
                                    <BarChartComp />
                                </div>

                                <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5'>
                                    <h2 className='font-medium text-xl mb-5'>Title Sample</h2>
                                    <LineChartComp />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const SmallCard = ({ title, count, link, event }) => {

    if(event) {
        return (
            <div className='flex flex-col items-center justify-between w-32 h-28 py-4 text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default drop-shadow-md rounded-lg'>
                <p className='text-[11px] text-task-ss-dark-blue-500'>{title}</p>
                <p className='text-[30px]'>{count}</p>
                <button onClick={event} className='text-[9px] align-bottom hover:underline'>View full list</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-between w-32 h-28 py-4 text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default drop-shadow-md rounded-lg'>
            <p className='text-[11px] text-task-ss-dark-blue-500'>{title}</p>
            <p className='text-[30px]'>{count}</p>
            <Link href={link} className='text-[9px] align-bottom hover:underline'>View full list</Link>
        </div>
    )
}

export default Reports

Reports.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
  