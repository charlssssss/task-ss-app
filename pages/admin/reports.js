import axios from 'axios'
import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'
import AdminLayout from '../../layouts/adminLayout'

const PieChartComp = dynamic(() => import('../../components/chart/piechart'), { ssr: false })
const BarChartComp = dynamic(() => import('../../components/chart/barchart'), { ssr: false })

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[users, subs, feedbacks] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/users`, 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/subscriptions/all`, 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
            axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks/all`),
        ])
        return { 
            props: { 
                users: users.data.data.filter(item => item.role_id == '1'),
                subs: subs.data.data,
                feedbacks: feedbacks.data.data.data
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { users: null, subs: null, feedbacks: null }  }
    }
}

const Reports = ({ users, subs, feedbacks }) => {
    const month = subs.filter(sub => sub.subscription_type.id == 1)
    const year = subs.filter(sub => sub.subscription_type.id == 2)
    const active = subs.filter(sub => sub.status == 'active')
    const customers = users.filter(user => user.subscriptions.length > 0)
    const totalRevenue = subs.reduce((acc, sub) => acc + parseFloat(sub.subscription_type.sub_fee_price), 0)
    
    console.log("users", users)
    console.log("month", month)
    console.log("year", year)
    console.log("customers", customers)

    const subType = [
        { name: 'Monthly Plan', count: month.length, fill: '#E44545' },
        { name: 'Yearly Plan', count: year.length, fill: '#4f91f5' },
    ]

    const today = new Date();
    const lastWeekStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const lastWeekEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const lastWeekSubs = subs.filter(sub => {
        const createdDate = new Date(sub.created_at);
        return (createdDate >= lastWeekStartDate) && (createdDate < lastWeekEndDate);
    })

    const weekStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const weekEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

    const thisWeekSubs = subs.filter(sub => {
    const createdDate = new Date(sub.created_at);
    return (createdDate >= weekStartDate) && (createdDate <= weekEndDate);
    });

    const totalLastWeek = lastWeekSubs.reduce((acc, sub) => acc + parseFloat(sub.subscription_type.sub_fee_price), 0)

    const totalThisWeek = thisWeekSubs.reduce((acc, sub) => acc + parseFloat(sub.subscription_type.sub_fee_price), 0)

    const revenue = [
        { name: 'Last Week', count: totalLastWeek, fill: '#f5774f' },
        { name: 'This Week', count: totalThisWeek, fill: '#f5dc4f' },
    ]

    const overallRating = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.ratings), 0) / feedbacks.length

    const counts = feedbacks.reduce((acc, feedback) => {
        acc[feedback.ratings] = (acc[feedback.ratings] || 0) + 1
        return acc
      }, {})

    const percentages = Object.keys(counts).reduce((acc, rating) => {
        const count = counts[rating]
        const percentage = count / feedbacks.length * 100
        acc[rating] = percentage + "%"
        return acc
    }, {});

    console.log(totalLastWeek)
    console.log(totalThisWeek)
    
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
                            title='Total Users' 
                            count={users.length.toString().padStart(2, '0')} 
                            link='/user/useraccounts' 
                        />
                        <SmallCard 
                            title='Total Customers' 
                            count={customers.length.toString().padStart(2, '0')} 
                            link='/user/useraccounts' 
                        />
                        <SmallCard 
                            title='Active Customers' 
                            count={active.length.toString().padStart(2, '0')} 
                            link='/user/subscriptions' 
                        />
                        <SmallCard 
                            title='Total Revenue' 
                            count={parseFloat(totalRevenue).toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} 
                            link='/user/subscriptions' 
                        />
                    </div>

                    <div className='flex flex-col gap-3 xl:gap-0 xl:flex-row justify-between'>
                        <div className='w-full xl:w-[49%]'>
                            <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5 pr-8'>
                                <h2 className='font-medium text-xl mb-5'>Subscription Plan</h2>
                                <PieChartComp data={subType} />
                            </div>
                        </div>

                        <div className='w-full xl:w-[49%]'>
                            <div className='bg-task-ss-white-100 rounded-lg drop-shadow-md p-5 pr-8'>
                                <h2 className='font-medium text-xl mb-5'>Revenue</h2>
                                <BarChartComp data={revenue} />
                            </div>
                        </div>
                    </div>

                    <div className='bg-task-ss-white-100 py-6 px-8 rounded-lg drop-shadow-md mt-8'>
                        <h2 className='font-medium text-xl mb-8'>User Feedbacks and Ratings</h2>
                        <div className='flex gap-10'>
                            <div className='flex flex-col items-center'>
                            <h2 className='text-[70px] font-medium'>{overallRating.toFixed(1)}</h2>
                            <p className='mt-[-15px]'>{`${feedbacks.length} ${feedbacks.length > 1 ? 'Reviews' : 'Review'}`}</p>
                            </div>
                            
                            <div className='flex flex-col gap-2 justify-center w-full'>
                            <div className='flex items-center gap-3'>
                                <p className='text-xs'>5</p>
                                <div
                                style={{"--b-width" : percentages[5] }} 
                                className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[5] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                                ></div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <p className='text-xs'>4</p>
                                <div
                                style={{"--b-width" : percentages[4] }} 
                                className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[4] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                                ></div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <p className='text-xs'>3</p>
                                <div
                                style={{"--b-width" : percentages[3] }} 
                                className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[3] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                                ></div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <p className='text-xs'>2</p>
                                <div
                                style={{"--b-width" : percentages[2] }} 
                                className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[2] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                                ></div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <p className='text-xs'>1</p>
                                <div
                                style={{"--b-width" : percentages[1] }} 
                                className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[1] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                                ></div>
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
            <div className='flex flex-col items-center justify-between w-auto h-28 py-4 px-7  text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default drop-shadow-md rounded-lg'>
                <p className='text-[11px] text-task-ss-dark-blue-500'>{title}</p>
                <p className='text-[30px]'>{count}</p>
                <button onClick={event} className='text-[9px] align-bottom hover:underline'>View full list</button>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-between w-auto h-28 py-4 px-7 text-task-ss-dark-blue-200 bg-task-ss-white-100 cursor-default drop-shadow-md rounded-lg'>
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
  