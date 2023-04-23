import useSWR, { mutate } from 'swr'
import { FailedToLoad, Loading } from './errors'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetcher } from '../functions';
import { useRouter } from 'next/router';
const localizer = momentLocalizer(moment);



// component for task list
const CalendarView = ({ api, token }) => {
    const router = useRouter()

    // fetch data
    const { data, error, isLoading } = useSWR([api, token], fetcher)

    // handle errors
    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    const messages = {
        agenda: 'Task',
        day: 'Day',
        month: 'Month',
        previous: 'Prev',
        next: 'Next',
        today: 'Today',
        week: 'Week',
        date: 'Date',
        time: 'Time',
        event: 'Task Name',
        noEventsInRange: 'No events',
        showMore: total => `+${total} more`
    }

    const myEventsList = data.data.map(task => ({
        title: task.task_name,
        start: new Date(`${task.start_date} ${task.start_time}`),
        end: new Date(`${task.end_date} ${task.end_time}`),
        description: task.task_desc,
        category: task.category_id
    }))

    const handleRedirectTask = (task) => {
        console.log(task)
    }

    return (
        <div className='bg-task-ss-white-100 p-5 relative rounded-lg drop-shadow-md'>
            <Calendar
                messages={messages}
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleRedirectTask}
                tooltipAccessor={(event) => event.description}
            />                                      
        </div>
    )
}

export default CalendarView