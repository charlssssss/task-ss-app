import axios from 'axios'
import useSWR from 'swr'
import { useState } from "react"
import { useRouter } from 'next/router'
import { RegularButton } from "./buttons"
import { useSession } from 'next-auth/react'
import { RegularInput, RegularInput2 } from "./inputs"
import { fetcher, handleDeleteWebsite, handleEditWebsite, isValidUrl } from '../functions'
import { IoMdRemoveCircle } from 'react-icons/io'
import { Loading, FailedToLoad, Empty3 } from './errors'
import Link from 'next/link'
import { AiFillCheckCircle, AiOutlineCheckCircle } from 'react-icons/ai'

const WebsiteBlocker = ({ isBlockMdlClosed, blockMdlCloseHandler }) => {
    // fetch user token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    // add website variables
    const [webName, setWebName] = useState('')
    const [webURLName, setWebURLName] = useState('')
    const [validURL, setValidURL] = useState(false)

    const { data, error, isLoading } = useSWR(['http://localhost:8000/api/user/blockwebsites', userToken], fetcher)

    // clear and close modal
    const clearHandler = () => {
        setWebName('')
        setWebURLName('')
        blockMdlCloseHandler()
    }

    // clear modal
    const clearInputsHandler = () => {
        setWebName('')
        setWebURLName('')
    }

    // add category function
    const handleAddWebsite =  async (e) => {
        e.preventDefault()
        
        await axios('http://127.0.0.1:8000/api/user/blockwebsites', { 
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ 
                "website_name": webName,
                "website_link": webURLName,
                "is_include": true
            }),
        })
        .then(res => {
            console.log(res.data.message)
            alert(res.data.message)
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />
    
    const excludedWebsite = data.data.filter(web => web.is_include == false)

    return (
        <div 
            className={`justify-center items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 ${isBlockMdlClosed ? ' hidden ' : ' flex '}`} 
        >
            <div className='bg-task-ss-white-100 w-[90%] sm:w-[500px] h-auto rounded-lg relative z-20' >
                {/* add website form */}
                <div>
                    <div className='flex items-center py-3 px-5'>
                        <h2 className='font-semibold text-lg'>Edit Website Blocker</h2>
                    </div>
                    <hr className='text-task-ss-white-300'/>
                </div>
                
                {/* input fields */}
                <form method='POST' 
                    onSubmit={e => { handleAddWebsite(e); clearInputsHandler()}} 
                    className='py-2 px-5 flex flex-col'
                >
                    <RegularInput
                        name='website_name' 
                        title='Website Name' 
                        value={webName} 
                        change={setWebName} 
                        placeholder='e.g. YouTube' 
                    />
                    
                    
                    <RegularInput2
                        name='website_name' 
                        title='Website URL' 
                        value={webURLName} 
                        change={(e) => {
                            setValidURL(isValidUrl(webURLName))
                            setWebURLName(e.target.value)
                        }} 
                        placeholder='e.g. www.youtube.com'
                    />

                    <RegularButton 
                        type='dngr'
                        title='Add Website'
                        eventType='submit'
                        m='mb-3'
                        disabled={webName == '' || webURLName == '' || !validURL}
                    />

                    <hr className='text-task-ss-white-300'/>
                </form>
                
                <div className='py-2 px-5 flex flex-col'>
                    <h2 className='text-sm font-medium'>Websites to be Blocked ({data.data.length - excludedWebsite.length})</h2>

                    <div className='mt-2 mb-4 w-full h-32 border border-task-ss-white-300 overflow-y-auto'>
                        <ul>
                            {data.data.length > 0 ?
                                data.data.map((web, idx) => (
                                    <li key={idx.toString()}
                                        className={`flex items-center py-4 px-6 ${idx != data.data.length - 1 ? 'border-b border-task-ss-white-300' : ''}`}
                                    >
                                        <button className='mr-6 text-task-ss-purple active:scale-95'
                                            onClick={e => handleEditWebsite(e, web, userToken)}
                                        >
                                            {web.is_include ? 
                                                <AiFillCheckCircle size={19} /> 
                                            : 
                                                <AiOutlineCheckCircle size={19} />
                                            }
                                        </button>
                                        <div className='flex flex-col'>
                                            <h3 className='text-sm font-medium'>{web.website_name}</h3>
                                            <p className='text-xs'>{web.website_link}</p>
                                        </div>

                                        <button className='ml-auto active:scale-95 text-task-ss-red-200'
                                            onClick={e => handleDeleteWebsite(e, web.id, userToken)}
                                        >
                                            <IoMdRemoveCircle size={20} />
                                        </button>
                                        
                                    </li>
                                ))
                            :
                                <Empty3 
                                    title='blocked websites' 
                                    img='/illustration_3.png' 
                                    size='w-20'
                                    addMsg='Start adding now!'
                                    m='mt-4'
                                    
                                />
                            }
                        </ul>

                    </div>
                </div>
                {/* cancel and add button */}
                <div>
                    <hr className='text-task-ss-white-300'/>
                    <div className='flex flex-wrap md:flex-nowrap items-center justify-end py-3 px-5'>
                        <p className='text-[10px]'><b>NOTE:</b> The Task SS Website Blocker is only available through the Task SS Official Website Blocker Chrome Extension.</p>
                        <RegularButton 
                            type='snd' 
                            title='Close' 
                            event={clearHandler}
                            eventType='button'
                        />
                    </div>
                </div>
            </div>
            
            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={clearHandler}
            ></div>
        </div>
    )
}
 
export default WebsiteBlocker