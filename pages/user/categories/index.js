import Head from 'next/head'
import TitleHeader from '../../../components/user/titleheader'
import CategoryList from '../../../components/user/categorylist'

// category layout
const Categories = () => {
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