import axios from 'axios'
import { useState } from "react"
import { useRouter } from 'next/router'
import { RegularButton } from "./buttons"
import { useSession } from 'next-auth/react'
import { RegularDropDown, RegularInput, RegularTextArea } from "./inputs"
import useSWR from 'swr'
import { fetcher, handleAddCategory } from '../functions'
import { BsCheck } from 'react-icons/bs'

const colorOptions = [
    { 'value': '100', 'label': 'Orange' },
    { 'value': '200', 'label': 'Blue' },
    { 'value': '300', 'label': 'Green' },
    { 'value': '400', 'label': 'Yellow' },
    { 'value': '500', 'label': 'Red' },
]

const upgradeList = [
    'Unlimited categories',
    'Website Blocker',
    'Notifications pop-ups',
    'Recurring Tasks',
    'Scheduled auto-generated links'
]

const AddCategory = ({ isCatMdlClosed, catMdlCloseHandler }) => {
    const router = useRouter()

    // fetch user token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const { data: proPlan } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/subscriptions/currentplan`, userToken], fetcher)
    const { data: categoryCount } = useSWR([`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/categories`, userToken], fetcher)

    // add category variables
    const [catName, setCatName] = useState('')
    const [catDesc, setCatDesc] = useState('')
    const [color, setColor] = useState('100')

    // clear input fields
    const clearHandler = () => {
        catMdlCloseHandler()
        setCatName('')
        setCatDesc('')
        setColor('100')
    }
    
    return (
        <div 
            className={`justify-center items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 z-20 ${isCatMdlClosed ? ' hidden ' : ' flex '}`} 
        >
            {(!proPlan?.data && categoryCount?.data?.length >= 5) ?
                <div className='bg-task-ss-white-100 w-[90%] sm:w-[350px] h-auto rounded-lg relative z-20'>
                {/* add category form */}
                    <div>
                        <div className='flex items-center py-3 px-5'>
                            <h2 className='font-semibold text-lg'>Need more categories?</h2>
                        </div>
                        <hr className='text-task-ss-white-300'/>
                    </div>

                    <div className='p-5'>
                        <div className='flex flex-col items-center bg-task-ss-white-200 rounded-lg p-4'>
                            <img src='/illustration_2.png' className='my-5 w-40' />
                            
                            <div>
                                <h1 className='font-semibold'>Get more with the Pro plan</h1>
                                <ul className='mt-2 text-sm font-light'>
                                    {upgradeList.map((item, idx) => (
                                    <li key={idx.toString()} className='mb-2 flex gap-2'><BsCheck size={20} className='text-task-ss-green-200' />{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>           

                    <div>
                        <hr className='text-task-ss-white-300'/>
                        <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                            <RegularButton 
                                type='pmry' 
                                title='Subscribe Now!'
                                link='/pricing/subscribe'
                            />
                        </div>
                    </div>
                </div>
            :
                <div className='bg-task-ss-white-100 w-[90%] sm:w-[400px] h-auto rounded-lg relative z-20'>
                    {/* add category form */}
                    <form method='POST' onSubmit={(e) => {
                            const dataValues = {
                                "category_name": catName,
                                "category_desc": catDesc,
                                "color": color
                            }
                            handleAddCategory(e, dataValues, userToken, router, clearHandler)
                        }}
                    >
                        <div>
                            <div className='flex items-center py-3 px-5'>
                                <h2 className='font-semibold text-lg'>Add Category</h2>
                            </div>
                            <hr className='text-task-ss-white-300'/>
                        </div>

                        {/* input fields */}
                        <div className='py-2 px-5'>
                            {(categoryCount?.data?.length == 4 && !proPlan?.data) &&
                                <div className='bg-task-ss-white-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center'>
                                    <div className='flex flex-col gap-1 text-xs md:w-[60%]'>
                                        <p className='font-medium'>1 category left on the Free plan!</p>
                                        <p className='text-[10px] leading-tight text-task-ss-white-400'>Upgrade to Task SS Pro and make even more categories.</p>
                                    </div>
                                    <RegularButton
                                        type='pmry'
                                        title='Upgrade Now'
                                        link='/pricing/subscribe'
                                    />
                                </div>
                            }
                            <RegularInput 
                                name='category_name' 
                                title='Category Name' m='mb-6' 
                                placeholder='e.g. School Works'
                                value={catName} change={setCatName} 
                            />
                            <RegularTextArea 
                                name='category_desc' 
                                title='Category Description' m='mb-6' 
                                placeholder='e.g. All stuffs related to school'
                                value={catDesc} change={setCatDesc}
                            />
                            <RegularDropDown 
                                name='color' 
                                title='Color' m='mb-6' 
                                options={colorOptions}
                                value={color} change={setColor}
                            />
                        </div>
                        
                        {/* cancel and add button */}
                        <div>
                            <hr className='text-task-ss-white-300'/>
                            <div className='flex flex-wrap items-center justify-end py-3 px-5'>
                                <RegularButton 
                                    type='snd' 
                                    title='Cancel' 
                                    m='mr-2' event={clearHandler}
                                    eventType='button'
                                />
                                <RegularButton 
                                    type='pmry' 
                                    title='Add Category'
                                    eventType='submit'
                                    disabled={catName == ''}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            }
            
            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={clearHandler}
            ></div>
        </div>
    )
}
 
export default AddCategory