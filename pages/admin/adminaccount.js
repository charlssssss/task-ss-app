import Head from 'next/head'
import TitleHeader from '../../components/admin/titleheader'
import AdminLayout from '../../layouts/adminLayout'
import TableList from '../../components/admin/tablelist'

const AdminAccount = () => {
    return (
        <>
            <Head>
                <title>Dashboard: Task SS</title>
            </Head>

            <TitleHeader title='Admin Accounts' />

            <TableList
                api='http://127.0.0.1:8000/api/user/users'
                sort='2'
            />
        </>
    )
}
 
export default AdminAccount

AdminAccount.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  