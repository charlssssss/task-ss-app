import Head from 'next/head'
import TitleHeader from '../../components/user/titleheader'
import AdminLayout from '../../layouts/adminLayout'

const Dashboard = () => {
    return (
        <>
            <Head>
                <title>Dashboard: Task SS</title>
            </Head>

            <TitleHeader title='Admin Dashboard' />
        </>
    )
}
 
export default Dashboard

Dashboard.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  