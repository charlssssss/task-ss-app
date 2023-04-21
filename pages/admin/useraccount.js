import Head from 'next/head'
import TitleHeader from '../../components/admin/titleheader'
import AdminLayout from '../../layouts/adminLayout'
import TableList from '../../components/admin/tablelist'

const UserAccount = () => {
    return (
        <>
            <Head>
                <title>Dashboard: Task SS</title>
            </Head>

            <TitleHeader title='User Accounts' />

            <TableList
                api='http://127.0.0.1:8000/api/user/users'
                sort='1'
            />
        </>
    )
}
 
export default UserAccount

UserAccount.getLayout = function PageLayout(page) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
  }
  