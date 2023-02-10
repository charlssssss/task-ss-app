import useSWR from 'swr'
import Link from 'next/link'
import { FailedToLoad, Loading } from './errors'

// component for buttons with icons, (for consistent design, reusable)
export const IconButton = ({ icon, hover, event, link }) => {
    
    if(!link) {
        return (
            <button className={`p-2 mr-2 rounded-md ${hover ? 'hover:bg-task-ss-white-200' : null}`} onClick={event}>
                {icon}
            </button>
        )
    }
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

const fetcher = (...args) => fetch(...args).then(res => res.json())
// component for category buttons at sidebar (for consistent design)
export const SideCategoryButton = ({ router }) => {
    // fetch data
    const { data, error, isLoading } = useSWR('http://localhost:8000/api/categories', fetcher)
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
                        <p className='ml-4 text-md font-light'>{category.category_name}</p>
                    </div>
                </Link>
            ))}
        </>
    )
}