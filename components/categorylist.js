import useSWR from 'swr'
import axios from 'axios'
import Link from "next/link"
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { FailedToLoad, Loading } from './errors'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'

// const fetcher = (...args) => fetch(...args).then(res => res.json())
const fetcher = ([url, token]) => 
    axios.get(url, { headers: { 'Authorization': 'Bearer ' + token }
   }).then(res => res.data)

// component for category list
const CategoryList = () => {
    const { data: session } = useSession()
    let userToken
    if(session) {
        userToken = session.user.token
    }

    // fetch data
    const { data, error, isLoading } = useSWR(['http://localhost:8000/api/user/categories', userToken], fetcher)

    const [hover, setHover] = useState(false)
    const [current, setCurrent] = useState('')

    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    return (
        <>
            {data.data.map(category => (
                <div 
                    key={category.id} 
                    className='flex justify-between'
                    onMouseEnter={()=> { setHover(true); setCurrent(category.id) }}
                    onMouseLeave={()=> { setHover(false); setCurrent('') }}
                >
                    {/* category info */}
                    <Link 
                        className={`flex items-start py-4 px-7 w-full cursor-default rounded-xl  ${(hover &&  current == category.id) ? 'bg-task-ss-white-300' : ''}`} 
                        href={`/user/categories/${category.id}`}
                    >
                        <div className={`rounded-full w-3 h-3 mt-2 mr-4 bg-task-ss-category-${category.color.toString()}`}></div>
                        <div className='flex flex-col'>
                            <p className='font-medium'>{category.category_name}</p>
                            <p className='text-sm'>{category.category_desc}</p>
                        </div>
                    </Link>

                    {/* edit, delete part */}
                    <div className={`flex items-center pl-2 text-task-ss-white-400 ${(hover &&  current == category.id) ? '' : 'hidden'}`}>
                        <div className='transition-all rounded-md mr-1 hover:bg-task-ss-white-300 hover:text-task-ss-white-500'>
                            <AiOutlineEdit size={20} className='m-[5px]' />
                        </div>
                        <div className='transition-all rounded-md hover:bg-task-ss-white-300 hover:text-task-ss-white-500'>
                            <AiOutlineDelete size={20} className='m-[5px]'/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default CategoryList