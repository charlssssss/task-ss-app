import Link from "next/link"
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

// component for category list
const CategoryList = () => {
    // fetch data
    const { data, error, isLoading } = useSWR('http://localhost/task-ss-api/api/category/index.php', fetcher)

    // handle errors
    if (error) return <div>Failed to load</div>
    if (isLoading) return <div>Loading...</div>

    return (
        <>
            {data.data.map(category => (
                <Link key={category.category_id} className='flex items-start py-4 px-7 rounded-xl hover:bg-task-ss-white-300' href={`/categories/${category.category_id}`}>
                <div className={`rounded-full w-3 h-3 mt-2 mr-4 bg-task-ss-category-${category.color.toString()}`}></div>
                <div className='flex flex-col'>
                    <p className='font-medium'>{category.category_name}</p>
                    <p className='text-sm'>{category.category_desc}</p>
                </div>
            </Link>
            ))}
        </>
    )
}

export default CategoryList