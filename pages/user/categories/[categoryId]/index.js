import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { getSession } from 'next-auth/react'
import TaskList from '../../../../components/user/tasklist'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { useRouter } from 'next/router'
import EditCategory from '../../../../components/user/editcategory'
import { handleDeleteCategory } from '../../../../components/functions'

// fetching all categories and single category
export const getServerSideProps = async (context) => {
    const id = context.params.categoryId
    const res = await getSession(context)
    const { data } = await axios.get(`http://localhost:8000/api/user/categories/${id}`, 
        { headers: { 'Authorization': 'Bearer ' + res.user.token } })

    if(!data) {
        return { notFound: true }
    } 
    return { props: { category: data.data, userToken: res.user.token } }
}

// category detail layout
const CategoryDetail = ({ category, userToken }) => {
    const router = useRouter()

    // edit category modal
    const [isCatMdlClosed, setIsCatMdlClosed] = useState(true)
    const catMdlCloseHandler = () => setIsCatMdlClosed(!isCatMdlClosed)

    const[editCat, setEditCat] = useState({})

    // front end variables
    const [hover, setHover] = useState(false)

    return (
        <>
            <Head>
                <title>{`${category.category_name} : Task SS`}</title>
            </Head>
            
            <div className='flex justify-between border-b border-b-task-ss-white-300 pb-4 mb-4'
                onMouseEnter={()=> setHover(true)} 
                onMouseLeave={()=> setHover(false)}
            >
                <h3 className='text-2xl font-medium'>{category.category_name}</h3>

                {/* edit, delete part */}
                <div className={`items-center pl-2 text-task-ss-white-400 ${hover ? 'flex':'hidden'}`}>
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
                        onClick={(e) => handleDeleteCategory(e, category.id, userToken, router)}
                    >
                        <AiOutlineDelete size={20} className='m-[5px]'/>
                    </div>
                </div>
            </div>

            {/* user's list of tasks section */}
            <TaskList 
                api={`http://localhost:8000/api/user/tasks/category/${category.id}`} 
                token={userToken} 
                url={`${category.id}`}
            />

            <EditCategory 
                isCatMdlClosed={isCatMdlClosed} 
                catMdlCloseHandler={catMdlCloseHandler} 
                editCat={editCat}
                callbackUrl={`/user/categories/${category.id}`}
            />
        </>
    )
}
 
export default CategoryDetail