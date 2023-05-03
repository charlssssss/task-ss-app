import GeneralLayout from '../../layouts/generalLayout'
import Head from 'next/head'
import { useSession, signOut, getSession } from "next-auth/react"
import { RegularInput3 } from '../../components/user/inputs'
import { useEffect, useState } from 'react'
import { RegularButton } from '../../components/user/buttons'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IoIosClose } from 'react-icons/io'
import { HiOutlineUser } from 'react-icons/hi'
import { AiOutlineWallet } from 'react-icons/ai'
import moment from 'moment'
import { capFirst } from '../../components/functions'
import { Empty3 } from '../../components/user/errors'
import { BsGearFill } from 'react-icons/bs'

export const getServerSideProps = async (context) => {
  const res = await getSession(context)
  try {
      const[profile, subscriptions, currentPlan] = await Promise.all([
          axios.get('http://localhost:8000/api/user/profile', 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
          axios.get('http://localhost:8000/api/user/subscriptions', 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
          axios.get('http://localhost:8000/api/user/subscriptions/currentplan', 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
      ])
      return { 
          props: { 
            user: profile.data.data,
            subscriptions: subscriptions.data.data,
            currentPlan: currentPlan.data.data,
            userToken: res.user.token
          } 
      }
  
  } catch (error) {
      console.log(error)
      return { notFound: true }
  }
}

const Account = ({ user, subscriptions, currentPlan, userToken }) => {
  console.log(currentPlan)
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
      const { data } = await axios(`http://127.0.0.1:8000/api/user/profile`, { 
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
          router.push('/user/dashboard')
          alert(data.message)
      } else { alert(data.message) }
  }

  const handleDeleteUser =  async (e) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure you want to delete your account, ${user?.firstname}? \nAll of your data will be lost.`) ) {
        await axios(`http://127.0.0.1:8000/api/user/deleteUser/${user.id}`, { 
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

  const tabs = ['Account', 'Subscription']
  const statStyle = {
    'active': {style: 'text-task-ss-green-200'},
    'expired': {style: 'text-task-ss-red-200'},
  }

  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='w-[90%] h-[90%] md:w-[700px] md:h-[500px] bg-task-ss-white-100 mx-auto drop-shadow-lg rounded-lg overflow-hidden flex'>
          <div className='h-full w-[60px] sm:w-[30%] bg-task-ss-white-200 py-3 px-3 md:px-5'>
              <BsGearFill className='sm:hidden mx-auto' size={20} />
              <p className='text-[16px] font-medium hidden sm:block'>Settings</p>

              <div className='flex flex-col gap-2 my-5 text-task-ss-white-500'>
                <button 
                  className={`flex gap-3 p-2 items-center rounded-md ${activeTab == 0 ? 'bg-task-ss-white-300': 'hover:bg-task-ss-white-300' }`}
                  onClick={() => setActiveTab(0)}
                >
                  <HiOutlineUser />
                  <p className='text-sm hidden sm:block'>Account</p>
                </button>
                <button 
                  className={`flex gap-3 p-2 items-center rounded-md ${activeTab == 1 ? 'bg-task-ss-white-300': 'hover:bg-task-ss-white-300' }`}
                  onClick={() => setActiveTab(1)}
                >
                  <AiOutlineWallet />
                  <p className='text-sm hidden sm:block'>Subscription</p>
                </button>
              </div>
          </div>

          <div className='h-full w-[calc(100%-60px)] sm:w-[70%]'>
            <div className='flex justify-between items-center py-3 px-5'>
              <p className='text-sm font-medium'>{tabs[activeTab]}</p>

              <IoIosClose className='text-task-ss-white-400 cursor-pointer' size={20} onClick={() => router.push('/user/dashboard')} />
            </div>
            <hr className='text-task-ss-white-300'/>

            <div className='py-2 px-5 h-[calc(100%-45px)] overflow-y-auto'>
              {activeTab == 0 &&
                <form onSubmit={handleEditUser} className='flex flex-col'>
                  <div className='flex flex-col py-3'>
                    <p className='text-sm font-medium'>Plan</p>
                    {currentPlan ? 
                      <p className='text-sm mt-2'>{capFirst(currentPlan?.subscription_type?.sub_type_name)}</p>
                    :
                      <p className='text-sm mt-2'>Free</p>
                    }
                  </div>

                  <hr className='text-task-ss-white-300'/>

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
              }

              {activeTab == 1 &&
                <div className='flex flex-col'>
                  
                  {currentPlan ?
                    <div className='flex flex-col py-3'>
                      <p className='text-sm font-medium'>Current Plan</p>

                      <div className='flex justify-between mt-2 items-center'>
                        <div className='flex flex-col'>
                          <p className='text-[16px] font-medium'>{capFirst(currentPlan?.subscription_type?.sub_type_name)}</p>
                          <p className='text-xs text-task-ss-green-200'>{capFirst(currentPlan.status)}</p>
                        </div>

                        <div className='flex flex-col items-end'>
                          <p className='text-sm'>Ends: {moment(currentPlan.end_date).format('MMMM DD, YYYY')}</p>
                          <p className='text-sm'>{capFirst(currentPlan?.subscription_type?.interval)}</p>
                        </div>
                      </div>
                    </div>
                  :  
                  <div className='flex flex-col py-3'>
                    <p className='text-sm font-medium'>Current Plan</p>

                    <div className='flex justify-between mt-2 items-center'>
                      <p className='text-[16px] font-medium'>Free</p>

                      <RegularButton
                        type='pmry'
                        title='Upgrade Now'
                        link='/pricing'
                      />
                    </div>
                  </div>
                  }

                  <hr className='text-task-ss-white-300'/>

                  <div className='flex flex-col py-3'>
                    <p className='text-sm font-medium'>Subscription History</p>

                    <div className='flex flex-col mt-2 gap-2'>

                      {subscriptions.map((sub, idx) => (
                        <div
                          className='flex justify-between items-center py-2 px-3 rounded-md hover:bg-task-ss-white-200'
                          key={idx.toString()}
                        >
                          <div className='flex flex-col'>
                            <p className='text-sm font-medium'>{capFirst(sub?.subscription_type?.sub_type_name)}</p>
                            <p className={`text-xs ${statStyle[sub.status].style}`}>{capFirst(sub.status)}</p>
                          </div>

                          <div className='flex flex-col items-end'>
                            <p className='text-xs'>End date: {moment(sub.end_date).format('MMMM DD, YYYY')}</p>
                            <p className='text-xs'>{capFirst(sub?.subscription_type?.interval)}</p>
                          </div>
                        </div>
                      ))}

                      {subscriptions.length == 0 && 
                        <Empty3 title='History' img='/illustration_3.png' size='h-14' m='mt-10' />
                      }
                    </div>
                  </div>
                  
                </div>
              }

            </div>
          </div>
        </div>
      </div>

    {/* <div className='h-screen w-screen overflow-y-auto pb-10'>
        <div className='w-[70%] mx-auto py-20'>
          <TitleHeader title='Account Settings' />

          <form onSubmit={handleEditUser}>
            <RegularInput
              name='firstname'
              title='First Name'
              value={firstname}
              change={setFirstname}
              placeholder='First Name'
              m='mb-5'
            />
            
            <RegularInput
              name='lastname'
              title='Last Name'
              value={lastname}
              change={setLastname}
              placeholder='Last Name'
              m='mb-5'
            />

            <RegularInput
              name='phone'
              title='Phone Number'
              value={phone}
              change={setPhone}
              placeholder='Phone Number'
              m='mb-5'
            />
            
            <div className='flex justify-between'>
              <RegularButton
                type='dngr'
                title='Deactivate'
                event={handleDeleteUser}
              />

              <div className='flex gap-5'>
                <RegularButton
                  type='sndry'
                  title='Cancel'
                  link='/user/dashboard'
                />

                <RegularButton
                  type='pmry'
                  title='Save Changes'
                />
              </div>
            </div>
          </form>
        </div>
    </div> */}
    </>
  )
}
 
export default Account

Account.getLayout = function PageLayout(page) {
  return (
    <GeneralLayout>
      <Head>
        <title>Account: Task SS</title>
      </Head>
      {page}
    </GeneralLayout>
  )
}