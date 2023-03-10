import useSWR from 'swr'
import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { FailedToLoad, Loading } from '../user/errors'
import { fetcher, truncate } from '../functions'

// component for buttons with icons, (for consistent design, reusable)
export const IconButton = ({ icon, hover, event, link }) => {
    
    if(!link) return (
        <button className={`p-2 mr-2 rounded-md ${hover ? 'hover:bg-task-ss-white-200' : null}`} onClick={event}>
            {icon}
        </button>
    )

    return (
        <Link href={link}>
            <button className={`p-2 mr-2 rounded-md ${hover ? 'hover:bg-task-ss-white-200' : null}`}>
                {icon}
            </button>
        </Link>
    )
}

// component for side nav button (for consistent design)
export const SideNavButton = ({ icon, title, link, router }) => (
    <Link href={link} className='flex justify-between items-center'>
        <div className={`bg-task-ss-white-200 w-2 h-10 rounded-r-xl ${router.asPath == link ? 'scale-100' : 'scale-0'}`}></div>
        <div className={`flex items-center w-11/12 text-task-ss-white-300 pl-5 py-3 cursor-pointer hover:bg-task-ss-dark-blue-200 hover:text-task-ss-white-100 ${router.asPath == link ? 'bg-task-ss-dark-blue-200' : ''}`}>
            <i>{icon}</i>
            <p className='ml-4 text-md font-light'>{title}</p>
        </div>
    </Link>
)

// component for category buttons at sidebar (for consistent design)
export const SideCategoryButton = ({ router }) => {
    // get tokken
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }
    
    // fetch data
    const { data, error, isLoading } = useSWR(['http://localhost:8000/api/user/categories', userToken], fetcher)
    
    // handle errors
    if (error) return <FailedToLoad color='text-task-ss-white-100' />
    if (isLoading) return <Loading color='text-task-ss-white-100' />

    return (
        <>
            {data.data.map(category => (
                <Link href={`/user/categories/${category.id}`} key={category.id} className='flex justify-between items-center'>
                    <div className={`bg-task-ss-white-200 w-2 h-10 rounded-r-xl ${router.asPath == '/user/categories/'+category.id ? 'scale-100' : 'scale-0'}`}></div>
                    <div className={`flex items-center w-11/12 text-task-ss-white-300 pl-5 py-3 cursor-pointer hover:bg-task-ss-dark-blue-200 hover:text-task-ss-white-100 ${router.asPath == '/user/categories/'+category.id ? 'bg-task-ss-dark-blue-200' : ''}`}>
                        <div className={`rounded-full w-3 h-3 mr-4 bg-task-ss-category-${category.color.toString()}`}></div>
                        <p className='ml-4 text-md font-light'>{truncate(category.category_name, 20)}</p>
                    </div>
                </Link>
            ))}
        </>
    )
}

export const RegularButton = ({ type, title, event, eventType, m, disabled, link }) => {
    const btnType = {
        'pmry': ' bg-task-ss-purple text-task-ss-white-100 ',
        'snd': ' bg-task-ss-white-300 text-task-ss-dark-blue-300 ',
    }
    if(link) {
        return (
            <Link href={link}  className={`py-2 px-4 rounded-full active:scale-[0.98] ${btnType[type]} ${m}`}>
                <p className='text-sm font-medium'>{title}</p>
            </Link>
        )
    }

    if(disabled) {
        return (
            <button type={eventType} className={`py-2 px-4 cursor-not-allowed opacity-60 rounded-full active:scale-[0.98] ${btnType[type]} ${m}`} disabled>
                <p className='text-sm font-medium'>{title}</p>
            </button>
        )
    } return (
        <button type={eventType} className={`py-2 px-4 rounded-full active:scale-[0.98] ${btnType[type]} ${m}`} onClick={event}>
            <p className='text-sm font-medium'>{title}</p>
        </button>
    )
}

export const TaskIconButton = ({ event, icon, m, current, styles }) => {
    return (
        <button 
            type='button'
            className={`p-3 rounded-lg text-task-ss-white-400 border transition-all border-task-ss-white-300 active:scale-[0.98] ${m} ${styles[current]?.style}`} 
            onClick={event}>
            {icon}
        </button>
    )
}


export const TaskDateTimeButton = ({ title, color, dateValue, changeDate, timeValue, changeTime, state, event, m }) => {
    const dateFormatted = moment(dateValue).calendar({
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'MMM D'
    })
    
    const timeFormatted = moment(`${dateValue} ${timeValue}`).format('h:mma')

    return (
        <div className={`relative w-full md:w-auto ${m}`}>
            {/* button section */}
            <button type='button' className={`flex rounded-lg w-full py-3 px-4 text-sm mb-2 md:mb-0 ${color} border transition-all border-task-ss-white-300 active:scale-[0.98]`} onClick={event}>
                <AiOutlineCalendar />
                
                {state ? 
                    <p className='text-xs ml-2'>{dateFormatted} {timeValue && '|'} {timeFormatted}</p>
                    :
                    <p className='text-xs ml-2'>Confirm {title}</p>
                }
            </button>

            {/* dropdown section */}
            <div className={`absolute top-10 left-0 text-xs rounded-md py-3 px-5 bg-task-ss-white-100 border border-task-ss-white-300 z-30 ${state ? 'hidden' : 'flex flex-col'}`}>
                <div className='py-2'>
                    <label htmlFor='date' className='font-medium'>Date</label>
                    <input type='date' id='date' 
                        className='py-1 float-right' value={dateValue}
                        onChange={changeDate}
                    />
                </div>

                <hr className='text-task-ss-white-300' />

                <div className='py-2'>    
                    <label htmlFor='time' className='font-medium'>Time (optional)</label>
                    <input type='time' id='time'
                        className='py-1 float-right' value={timeValue}
                        onChange={changeTime}    
                    />
                </div>
            </div>
        </div>
    )
}