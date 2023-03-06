import { VscLoading } from 'react-icons/vsc'
import { MdSmsFailed } from 'react-icons/md'

// fail to load error component
export const FailedToLoad = ({ color }) => {
    return (
        <div className={`flex items-center justify-center mt-10 ${color}`}>
            <MdSmsFailed size={20} />
            <p className='ml-3 text-lg'>Failed to Load</p>
        </div>
    )
}

// loading error component
export const Loading = ({ color }) => {
    return (
        <div className={`flex items-center justify-center mt-10 ${color}`}>
            <VscLoading className='animate-spin -z-20' size={20} />
            <p className='ml-3 text-lg'>Loading ...</p>
        </div>
    )
}

export const Empty = ({ user, title, img }) => {
    return (
        <div className='pt-16'>
            <div className='flex flex-col justify-center items-center'>
                <img src={img} className='w-32 mb-2' />
                <h3 className='font-medium text-md text-task-ss-dark-blue-500'>Have a great day, {user}!</h3>
                <p className='text-xs text-task-ss-white-400'>You are free from {title}. Nice one!</p>
            </div>
        </div>
    )
}