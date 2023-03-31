import axios from 'axios'
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { RegularButton } from "./buttons"
import { useSession } from 'next-auth/react'
import { RegularDropDown, RegularInput, RegularTextArea } from "./inputs"
import { mutate } from 'swr'

const colorOptions = [
    { 'value': '100', 'label': 'Orange' },
    { 'value': '200', 'label': 'Blue' },
    { 'value': '300', 'label': 'Green' },
    { 'value': '400', 'label': 'Yellow' },
    { 'value': '500', 'label': 'Red' },
]

const EditCategory = ({ isCatMdlClosed, catMdlCloseHandler, editCat, callbackUrl }) => {
    const router = useRouter()

    // fetch user token
    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    // edit category variables
    const [catName, setCatName] = useState('')
    const [catDesc, setCatDesc] = useState('')
    const [color, setColor] = useState('100')

    useEffect(() => {
        setCatName(editCat.category_name)
        setCatDesc(editCat.category_desc)
        setColor(editCat.color)
	}, [editCat])

    // clear input fields
    const clearHandler = () => {
        setCatName(editCat.category_name)
        setCatDesc(editCat.category_desc)
        setColor(editCat.color)
        catMdlCloseHandler()
    }

    // add category function
    const handleEditCategory =  async (e) => {
        e.preventDefault()
        const { data } = await axios(`http://127.0.0.1:8000/api/user/categories/${editCat.id}`, { 
            method: 'PUT',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: JSON.stringify({ 
                "category_name": catName,
                "category_desc": catDesc,
                "color": color
            }),
        })

        if(data.success) {
            clearHandler()
            router.push(callbackUrl)
            mutate('http://127.0.0.1:8000/api/user/categories')
            alert(data.message)
        } else { alert(data.message) }
    }
    
    return (
        <div 
            className={`justify-center items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 ${isCatMdlClosed ? ' hidden ' : ' flex '}`} 
        >
            <div className='bg-task-ss-white-100 w-[400px] h-auto rounded-lg relative z-20' >
                {/* add category form */}
                <form method='PUT' onSubmit={handleEditCategory}>
                    <div>
                        <div className='flex items-center py-3 px-5'>
                            <h2 className='font-semibold text-lg'>Edit Category</h2>
                        </div>
                        <hr className='text-task-ss-white-300'/>
                    </div>

                    {/* input fields */}
                    <div className='py-2 px-5'>
                        <RegularInput 
                            name='category_name' 
                            title='Category Name' m='mb-6' 
                            placeholder='e.g. School Works' 
                            value={catName ?? ''} change={setCatName} 
                        />
                        <RegularTextArea 
                            name='category_desc' 
                            title='Category Description' m='mb-6' 
                            placeholder='e.g. All stuffs related to school'
                            value={catDesc ?? ''} change={setCatDesc}
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
                        <div className='flex items-center justify-end py-3 px-5'>
                            <RegularButton 
                                type='snd' 
                                title='Cancel' 
                                m='mr-2' event={clearHandler}
                                eventType='button'
                            />
                            <RegularButton 
                                type='pmry' 
                                title='Edit Category'
                                disabled={catName == ''}
                                eventType='submit'
                            />
                        </div>
                    </div>
                </form>
            </div>
            
            {/* clear all input when clicking the background or exiting modal */}
            <div 
                className={`justify-center items-center absolute top-0 left-0 w-screen h-screen`} 
                onClick={clearHandler}
            ></div>
        </div>
    )
}
 
export default EditCategory