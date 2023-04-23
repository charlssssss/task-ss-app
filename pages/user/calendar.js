import { useSession } from 'next-auth/react'
import CalendarView from '../../components/user/calendarview'

const Calendar = () => {
    // get user token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    return (
        <CalendarView
            api='http://localhost:8000/api/user/tasks/sortfilter?status=pending'
            token={userToken}
        />
    )
}
 
export default Calendar