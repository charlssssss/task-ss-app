import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'

const BarChartComp = dynamic(() => import('../../components/chart/barchart'), { ssr: false })
const LineChartComp = dynamic(() => import('../../components/chart/linechart'), { ssr: false })
const PieChartComp = dynamic(() => import('../../components/chart/piechart'), { ssr: false })

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[upcomingTasks, completedCount, blockedkWebCount, categories] = await Promise.all([
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter/end_date/asc', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/tasks/sortfilter?status=completed', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/blockwebsites/includes', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get('http://127.0.0.1:8000/api/user/categories', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                upcomingTasks: upcomingTasks.data.data,
                completedCount: completedCount.data.data.length,
                blockedkWebCount: blockedkWebCount.data.data.length,
                categories: categories.data.data,
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { notFound: true }
    }
}

const ProductivityReports = ({upcomingTasks, completedCount, blockedkWebCount, categories }) => {
    const totalTasks = upcomingTasks.filter(task => task.end_date != null)
    const pendingTasks = upcomingTasks.filter(task => task.status == 'pending')
    const overdueTasks = upcomingTasks.filter(task => task.status == 'overdue')
    const completedTasks = upcomingTasks.filter(task => task.status == 'completed')

    const barColor = {
        "100": '#f5774f',
        "200": '#4f91f5',
        "300": '#4ff5a9',
        "400": '#f5dc4f',
        "500": '#f5534f',
    }

    const categoryTask = categories.map(cat => ({
        cat_id: cat.id,
        category_name: cat.category_name,
        task_count: cat.tasks.length,
        fill: barColor[cat.color],
    }))


    const pieTasks = [
        { name: "Pending", count: pendingTasks.length, fill: "#F5D04F" },
        { name: "Overdue", count: overdueTasks.length, fill: "#E44545" },
        { name: "Completed", count: completedTasks.length, fill: "#4f91f5" },
    ]
    console.log("p", pendingTasks, "o", overdueTasks, "c", completedTasks)
    console.log(pieTasks)

    return (
        <>
            <Head>
                <title>Productivity Reports: Task SS</title>
            </Head>

            <TitleHeader title='Productivity Reports' />

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
                            count={pendingTasks.length.toString().padStart(2, '0')} 
                            link='/user/inbox' 
                        />
                        <SmallCard 
                            title='Completed Tasks' 
                            count={completedCount.toString().padStart(2, '0')} 
                            link='/user/completed' 
                        />
                        <SmallCard 
                            title='Overdue Tasks' 
                            count={overdueTasks.length.toString().padStart(2, '0')} 
                            link='/user/dashboard' 
                        />
                        <SmallCard 
                            title='Categories' 
                            count={categories.length.toString().padStart(2, '0')} 
                            link='/user/categories' 
                        />
                        <SmallCard 
                            title='Block Websites' 
                            count={blockedkWebCount.toString().padStart(2, '0')}  
                            event={() => blockMdlCloseHandler()} 
                        />
                    </div>

                    <div className='flex flex-col gap-3 xl:gap-0 xl:flex-row justify-between'>
                        <div className='w-full xl:w-[49%]'>
                            <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5 pr-8'>
                                <h2 className='font-medium text-xl mb-5'>Task Count by Status</h2>
                                <PieChartComp data={pieTasks} />
                            </div>
                        </div>

                        <div className='w-full xl:w-[49%]'>
                            <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5 pr-8'>
                                <h2 className='font-medium text-xl mb-5'>Tasks Count by Category</h2>
                                <BarChartComp data={categoryTask} />
                            </div>
                        </div>
                    </div>

                    <table className="table-auto bg-task-ss-white-100 w-full rounded-lg drop-shadow-md mt-8">
                        <thead className="text-xs">
                            <tr className="border-b border-task-ss-white-300">
                                <th className="px-6 py-5 text-left">ID</th>
                                <th className="px-6 py-5 text-left">CATEGORY NAME</th>
                                <th className="px-6 py-5 text-left">STATUS</th>
                                <th className="px-6 py-5 text-left">NO. OF TASKS</th>
                            </tr>
                        </thead>
                        <tbody className='text-xs'>
                            {categoryTask.map((cat, idx) => (
                                <tr 
                                    className={`${idx % 2 == 0 ? 'bg-task-ss-white-200 bg-opacity-50' : '' } border-b border-task-ss-white-300 hover:bg-task-ss-white-200 hover:bg-opacity-75 cursor-pointer`}
                                    key={idx.toString()}
                                >
                                    <td className="px-6 py-4">{cat.cat_id}</td>
                                    <td className="px-6 py-4">{cat.category_name}</td>
                                    <td className="px-6 py-4">Completed</td>
                                    <td className="px-6 py-4">{cat.task_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default ProductivityReports