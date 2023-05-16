import GeneralLayout from '../../layouts/generalLayout'
import Head from 'next/head'
import { signOut, getSession } from "next-auth/react"
import { RegularInput3 } from '../../components/user/inputs'
import { useEffect, useState } from 'react'
import { RegularButton } from '../../components/user/buttons'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IoIosClose } from 'react-icons/io'
import { HiOutlineUser } from 'react-icons/hi'
import { BsGearFill } from 'react-icons/bs'

export const getServerSideProps = async (context) => {
  const res = await getSession(context)
  try {
      const[profile] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
      ])
      return { 
          props: { 
            user: profile.data.data,
            userToken: res.user.token
          } 
      }
  } catch (error) {
      console.log(error)
      return { props: { user: null, userToken: null } }
  }
}

const Account = ({ user, userToken }) => {
  const router = useRouter()

    // credentials variables
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
      setFirstname(user?.firstname)
      setLastname(user?.lastname)
      setPhone(user?.phone)
    }, [user])

    // add category function
    const handleEditUser =  async (e) => {
      e.preventDefault()
      const { data } = await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, { 
          method: 'PATCH',
          headers: {
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
          data: JSON.stringify({ 
              "firstname" : firstname,
              "lastname" : lastname,
              "phone" : phone
          }),
      })

      if(data.success) {
          router.push('/admin/useraccounts')
          alert(data.message)
      } else { alert(data.message) }
  }

  const handleDeleteUser =  async (e) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure you want to delete your account, ${user?.firstname}? \nAll of your data will be lost.`) ) {
        await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/deleteUser/${user.id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + userToken }
        })
        .then(res => {
            if(res.data.success) {
                signOut({ redirect: false })
                router.push('/')
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
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='w-[90%] h-[70%] md:w-[700px] md:h-[450px] bg-task-ss-white-100 mx-auto drop-shadow-lg rounded-lg overflow-hidden flex'>
          <div className='h-full w-[60px] sm:w-[30%] bg-task-ss-white-200 py-3 px-3 md:px-5'>
              <BsGearFill className='sm:hidden mx-auto' size={20} />
              <p className='text-[16px] font-medium hidden sm:block'>Settings</p>

              <div className='flex flex-col gap-2 my-5 text-task-ss-white-500'>
                <button className='flex gap-3 p-2 items-center rounded-md bg-task-ss-white-300'>
                  <HiOutlineUser />
                  <p className='text-sm hidden sm:block'>Admin Account</p>
                </button>
              </div>
          </div>

          <div className='h-full w-[calc(100%-60px)] sm:w-[70%]'>
            <div className='flex justify-between items-center py-3 px-5'>
              <p className='text-sm font-medium'>Account</p>

              <IoIosClose className='text-task-ss-white-400 cursor-pointer' size={20} onClick={() => router.push('/admin/useraccounts')} />
            </div>
            <hr className='text-task-ss-white-300'/>

            <div className='py-2 px-5 h-[calc(100%-45px)] overflow-y-auto'>
              <form onSubmit={handleEditUser} className='flex flex-col'>
                <div className='flex flex-col py-3'>
                  <RegularInput3
                    name='firstname'
                    title='First Name'
                    value={firstname}
                    change={(e) => setFirstname(e.target.value)}
                    placeholder='First Name'
                    textSize='text-[12px]'
                    inputP='py-1 px-2'
                  />

                  <RegularInput3
                    name='lastname'
                    title='Last Name'
                    value={lastname}
                    change={(e) => setLastname(e.target.value)}
                    placeholder='Last Name'
                    textSize='text-[12px]'
                    inputP='py-1 px-2'
                  />

                  <RegularInput3
                    title='Email'
                    value={user?.email}
                    change={null}
                    placeholder='Email'
                    textSize='text-[12px]'
                    inputP='py-1 px-2'
                    disabled={true}
                  />

                  <RegularInput3
                    name='phone'
                    title='Phone Number'
                    value={phone}
                    change={(e) => setPhone(e.target.value)}
                    placeholder='Phone Number'
                    textSize='text-[12px]'
                    inputP='py-1 px-2'
                  />

                  <div className='mt-3 flex justify-between flex-wrap gap-2'>
                    <RegularButton
                      type='dngr'
                      title='Delete Account'
                      event={handleDeleteUser}
                    />

                    <RegularButton
                      type='pmry'
                      title='Save Changes'
                    />
                  </div>
                </div>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
 
export default Account

Account.getLayout = function PageLayout(page) {
  return (
    <GeneralLayout>
      <Head>
        <title>Admin Account: Task SS</title>
      </Head>
      {page}
    </GeneralLayout>
  )
}