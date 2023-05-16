import { useSession } from 'next-auth/react'
import CalendarView from '../../components/user/calendarview'

const Calendar = () => {
    // get user token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    return (
        <CalendarView
            api={`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/tasks/sortfilter?status=pending`}
            token={userToken}
        />
    )
}
 
export default Calendar