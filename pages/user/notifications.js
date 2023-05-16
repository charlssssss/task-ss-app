import Head from 'next/head'
import TitleHeader from '../../components/user/titleheader'
import NotificationList from '../../components/user/notificationlist'

const Notifications = () => {
    return (
        <>
            <Head>
                <title>Notifications: Task SS</title>
            </Head>

            <TitleHeader title='Notifications' />
            
            <NotificationList />
        </>
    )
}
 
export default Notifications