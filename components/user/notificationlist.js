import { useRouter } from "next/router"
import { Empty2, FailedToLoad, Loading } from "./errors"
import { useSession } from "next-auth/react"
import { fetcher } from "../functions"
import axios from "axios"
import useSWR, { mutate } from 'swr'
import { BsEnvelope, BsEnvelopeOpen, BsFillCircleFill, BsTrash } from "react-icons/bs"

const NotificationList = () => {
    const router = useRouter()
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data, error, isLoading } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications`, userToken], fetcher)

    const notifs = data?.data.filter(notif => notif.display == 1)

    const handleMarkAsRead =  async (e, id) => {
        e.preventDefault()
        await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications/${id}`, { 
            method: 'PUT',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ 
                "status" : 1
            }),
        })
        .then(res => {
            if(res.data.success) {
                mutate(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications`)
                alert('Notification Marked as Read')
                router.push('/user/notifications')
            } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error)
            alert(error)
        })
    }

    const handleDeleteNotification =  async (e, id) => {
        e.preventDefault()
        if(confirm(`Are you sure you want to delete notification no.${id}?`) ) {
            await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + userToken }
            })
            .then(res => {
                if(res.data.success) {
                    mutate(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/notifications`)
                    alert(res.data.message)
                    router.push('/user/notifications')
                } else { alert(res.data.message) }
            })
            .catch(error => {
                console.log(error)
                alert(error)
            })
        }
    }   

    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />

    return(
        <>
            {notifs?.length > 0 ?
                <div className='flex flex-col bg-task-ss-white-100 rounded-xl drop-shadow-md '>
                {notifs.map((notif, idx) => {
                    if(notif.status == 0) {
                        return (
                            <div 
                                className='flex flex-col'
                                key={idx.toString()}
                            >
                                <div className='flex flex-wrap justify-between py-5 px-6 bg-task-ss-white-100 hover:drop-shadow-md'>
                                    <div className='flex items-center gap-5'>
                                        <BsFillCircleFill className='text-task-ss-dark-blue-200 hidden md:block' size={30} />
            
                                        <div className='flex flex-col md:flex-row gap-0 md:gap-3 items-start md:items-center'>
                                            <h2 className='font-medium text-md'>Reminder</h2>
                                            <p className='text-sm font-light'>{notif.description}</p>
                                        </div>
            
                                    </div>
                                    
                                    <div className='flex gap-5 ml-auto'>
                                        <button onClick={(e) => handleMarkAsRead(e, notif.id)}>
                                            <BsEnvelopeOpen size={20} />
                                        </button>                    
                                        <button onClick={(e) => handleDeleteNotification(e, notif.id)}>
                                            <BsTrash size={20} />
                                        </button>                    
                                    </div>
                                </div>
                                <hr className='text-task-ss-white-300'/>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div 
                                className='flex flex-col'
                                key={idx.toString()}
                            >
                                <div className='flex flex-wrap justify-between py-5 px-6 bg-task-ss-white-200 hover:drop-shadow-md'>
                                    <div className='flex items-center gap-5'>
                                        <BsFillCircleFill className='text-task-ss-dark-blue-200 hidden md:block' size={30} />
            
                                        <div className='flex flex-col md:flex-row gap-0 md:gap-3 items-start md:items-center'>
                                            <h2 className='text-md'>Reminder</h2>
                                            <p className='text-sm font-light'>{notif.description}</p>
                                        </div>
            
                                    </div>
                                    
                                    <div className='flex gap-5 ml-auto'>
                                        <button>
                                            <BsEnvelope size={20} />
                                        </button>                    
                                        <button onClick={(e) => handleDeleteNotification(e, notif.id)}>
                                            <BsTrash size={20} />
                                        </button>                    
                                    </div>
                                </div>
                                <hr className='text-task-ss-white-300'/>
                            </div>
                        )
                    }
                })}
            </div>
            :
                <Empty2 title='notifications yet' img='/illustration_5.png' />
            }
        </>
    )
}

export default NotificationList