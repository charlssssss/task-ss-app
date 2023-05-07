import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { BsEnvelope, BsEnvelopeOpen, BsFillCircleFill, BsTrash } from 'react-icons/bs'
import moment from 'moment'
import { truncate } from '../../components/functions'
import { getSession } from 'next-auth/react'
import TitleHeader from '../../components/user/titleheader'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
    const res = await getSession(context)
    try {
        const[notifs] = await Promise.all([
            axios.get('http://localhost:8000/api/user/notifications', 
            { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
        ])
        return { 
            props: { 
                notifs: notifs.data.data.filter(notif => notif.display == 1),
                token: res.user.token,
            } 
        }
    
    } catch (error) {
        console.log(error)
        return { props: { notifs: null, token: null }  }
    }
}

const Notifications = ({ notifs, token }) => {
    const router = useRouter()

    const handleMarkAsRead =  async (e, id) => {
        e.preventDefault()
        await axios(`http://127.0.0.1:8000/api/user/notifications/${id}`, { 
            method: 'PUT',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            data: JSON.stringify({ 
                "status" : 1
            }),
        })
        .then(res => {
            if(res.data.success) {
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
            await axios(`http://127.0.0.1:8000/api/user/notifications/${id}`, { 
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            })
            .then(res => {
                if(res.data.success) {
                    router.push('/user/notifications')
                    alert(res.data.message)
                } else { alert(res.data.message) }
            })
            .catch(error => {
                console.log(error)
                alert(error)
            })
        }
    }    

    return (
        <>
            <Head>
                <title>Notifications: Task SS</title>
            </Head>

            <TitleHeader title='Notifications' />
            
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
        </>
    )
}
 
export default Notifications