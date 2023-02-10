import { VscLoading } from 'react-icons/vsc'
import { MdSmsFailed } from 'react-icons/md'

export const FailedToLoad = ({ color }) => {
    return (
        <div className={`flex items-center justify-center mt-10 ${color}`}>
            <MdSmsFailed size={20} />
            <p className='ml-3 text-lg'>Failed to Load</p>
        </div>
    )
}

export const Loading = ({ color }) => {
    return (
        <div className={`flex items-center justify-center mt-10 ${color}`}>
            <VscLoading className='animate-spin' size={20} />
            <p className='ml-3 text-lg'>Loading ...</p>
        </div>
    )
}