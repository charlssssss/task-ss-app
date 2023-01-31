import Head from 'next/head'
import TitleHeader from '../../../components/titleheader'

// fetching all categories and single category
export const getServerSideProps = async (context) => {
    const id = context.params.categoryId
    try {
        const res = await fetch(`http://localhost/task-ss-api/api/category/show.php?category_id=${id}`)
        const data = await res.json()
        return { props: { category: data.data } }
    }
    catch {
        return { notFound: true }
    }
}

// category detail layout
const CategoryDetail = ({ category }) => {
    return (
        <>
            <Head>
                <title>{category.category_name}: Task SS</title>
            </Head>

            <TitleHeader title={category.category_name} />

            {/* user's list of categories section */}
        </>
    )
}
 
export default CategoryDetail