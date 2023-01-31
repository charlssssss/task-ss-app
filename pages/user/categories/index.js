import Head from 'next/head'
import TitleHeader from '../../../components/titleheader'
import CategoryList from '../../../components/categorylist'

// category layout
const Categories = () => {
    // add category form variables
    // const [categoryName, setCategoryName] = useState('')
    // const [categoryDesc, setCategoryDesc] = useState('')
    // const [color, setColor] = useState('')

    // add category function
    // const addCategory = async (e) => {
    //     e.preventDefault()

    //     const response = await fetch('http://localhost/task-ss-api/api/category/store.php', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ 
    //             category_name: categoryName, 
    //             category_desc: categoryDesc,
    //             color: color,
    //         }),
    //     })

    //     const data = await response.json()
    // }

    return (
        <>
            <Head>
                <title>Categories: Task SS</title>
            </Head>
            
            <TitleHeader title='Categories' />

            {/* user's list of categories section */}
            <CategoryList />
        </>
    );
}

export default Categories

// fetching all categories
// export const getStaticProps = async () => {
//     try {
//         const res = await fetch('http://localhost/task-ss-api/api/category/index.php')
//         const data = await res.json()
//         return { props: { categories: data } }
//     }
//     catch {
//         return { notFound: true }
//     }
// }

/* <form onSubmit={addCategory}>
    <label htmlFor="category_name">Category Name</label>
    <input type="text" id="category_name" 
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
    required />

    <label htmlFor="category_desc">Category Desc.</label>
    <input type="text" id="category_desc"
            value={categoryDesc}
            onChange={e => setCategoryDesc(e.target.value)}
    required />
    
    <label htmlFor="color">Color</label>
    <input type="text" id="category_desc"
            value={color}
            onChange={e => setColor(e.target.value)}
    required />

    <button type="submit" onClick={addCategory}>Add Category</button>
</form> */