import useSWR from 'swr'
import axios from 'axios'
import Link from "next/link"
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Empty, FailedToLoad, Loading } from './errors'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { BsFillCircleFill } from 'react-icons/bs'
import EditCategory from './editcategory'

// fetcher function for useSWR hook
// const fetcher = (...args) => fetch(...args).then(res => res.json())
const fetcher = ([url, token]) => 
    axios.get(url, { headers: { 'Authorization': 'Bearer ' + token } }).then(res => res.data)

// component for category list
const CategoryList = () => {
    const router = useRouter()
    
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    // fetch data
    const { data, error, isLoading } = useSWR(['http://localhost:8000/api/user/categories', userToken], fetcher)

    // front end variables
    const [hover, setHover] = useState(false)
    const [current, setCurrent] = useState('')  
    const [deleted, setDeleted] = useState(null)

    // edit category modal
    const [isCatMdlClosed, setIsCatMdlClosed] = useState(true)
    const catMdlCloseHandler = () => setIsCatMdlClosed(!isCatMdlClosed)

    const[editCat, setEditCat] = useState({})
    
    // delete category function
    const handleDeleteCategory =  async (e, id) => {
        e.preventDefault()
        // confirmation
        if(confirm(`Are you sure u want to delete category no.${id}?`) ) {
            const { data } = await axios(`http://127.0.0.1:8000/api/user/categories/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + userToken }
            })
    
            if(data.success) {
                router.push('/user/categories')
                setDeleted(id)
                alert(data.message)
            } else { console.log(data.message) }
        }
    }

    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    if(data.data.length == 0) return <Empty user={session.user.firstname} title='categories' img='/illustration_2.png' />

    return (
        <>
            {data.data.map(category => {

                if(deleted != category.id) return (
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
                            <BsFillCircleFill className={`mt-2 mr-4 text-task-ss-category-${category.color.toString()}`} size={13} />
                            <div className='flex flex-col'>
                                <p className='font-medium'>{category.category_name}</p>
                                <p className='text-sm'>{category.category_desc}</p>
                            </div>
                        </Link>

                        {/* edit, delete part */}
                        <div className={`flex items-center pl-2 text-task-ss-white-400 ${(hover &&  current == category.id) ? '' : 'hidden'}`}>
                            {/* edit button */}
                            <div className='transition-all rounded-md mr-1 hover:bg-task-ss-white-300 hover:text-task-ss-white-500'
                                onClick={() => {
                                    catMdlCloseHandler()
                                    setEditCat(category)
                                }}
                            >
                                <AiOutlineEdit size={20} className='m-[5px]' />
                            </div>

                            {/* delete button */}
                            <div className='transition-all rounded-md hover:bg-task-ss-white-300 hover:text-task-ss-white-500'
                                onClick={(e) => handleDeleteCategory(e, category.id)}
                            >
                                <AiOutlineDelete size={20} className='m-[5px]'/>
                            </div>
                        </div>
                    </div>
                )
            })}

            <EditCategory 
                isCatMdlClosed={isCatMdlClosed} 
                catMdlCloseHandler={catMdlCloseHandler} 
                editCat={editCat}
            />
        </>
    )
}

export default CategoryList