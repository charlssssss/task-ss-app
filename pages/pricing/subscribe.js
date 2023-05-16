import GeneralLayout from '../../layouts/generalLayout'
import Link from 'next/link'
import Head from 'next/head'
import { getSession, useSession } from 'next-auth/react'
import { BsCheck } from 'react-icons/bs'
import { RegularButton } from '../../components/user/buttons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import ConfirmPayment from '../../components/user/confirmpayment'

const proList = [
  'Unlimited categories',
  'Website Blocker',
  'Recurring Tasks',
  // 'Scheduled auto-generated links'
]

const bill = {
  'monthly': { price: '₱300' },
  'yearly': { price: '₱2,880' }, 
}

export const getServerSideProps = async (context) => {
  const res = await getSession(context)
  try {
      const[currentPlan] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/subscriptions/currentplan`, 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
      ])
      return { 
          props: { 
            currentPlan: currentPlan.data.data
          } 
      }
  
  } catch (error) {
      console.log(error)
      return { props: { currentPlan: null }  }
  }
}

const Subscribe = ({ currentPlan }) => {
  const { data: session } = useSession()
  let user
  if(session) { user = session.user }

  const [isCnfrmPymntClosed, setIsCnfrmPymntClosed] = useState(true)
  const cnfrmPymntCloseHandler = () => setIsCnfrmPymntClosed(!isCnfrmPymntClosed)
  
  const [subscribeData, setSubscribeData] = useState({
    fullName: "",
    token: "",
    email: "",
    plan: "monthly",
  })

  useEffect(() => {
    setSubscribeData(prev => {
      return { ...prev, fullName: `${user?.firstname} ${user?.lastname}`, email: user?.email, token: user?.token }
    })
  }, [user])

  const onChange = (e) => {
    const { name, value } = e.target

    setSubscribeData( prev => {
      return { ...prev, [name]: value }
    })
  }

  return (
    <div className='h-screen w-screen overflow-y-auto pb-10'>
      <div className='flex items-center w-full h-14 mt-4 mb-14'>
        <div className='flex flex-col mx-14 w-screen'>
          <div className='flex justify-between items-center'>
            <Link href='/'>
              <img src='/task_ss_logo_dark.png' className='h-8 w-auto'/>
            </Link>
            
            <div className='flex flex-col items-end'>
              <h3 className='text-lg font-semibold text-task-ss-dark-blue-300'>{`${subscribeData.fullName}`}</h3>
              <p className='text-xs text-task-ss-white-400'>{subscribeData.email}</p>
            </div>

          </div>
        </div>
      </div>
      <div className='mx-14 flex flex-wrap justify-center md:justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-semibold text-center md:text-start'>Task SS Pro Plan</h1>

          <ul className='my-5 font-light flex flex-col items-center md:items-start'>
            {proList.map((item, idx) => (
              <li key={idx.toString()} className='mb-3 flex'><BsCheck size={20} className='mr-2 text-task-ss-green-200' />{item}</li>
            ))}
          </ul>

        </div>
        
        <div className='w-screen bg-task-ss-white-100 md:w-[60%] rounded-md drop-shadow-lg px-8 py-6'>
          <h3 className='mb-2'>Plan</h3>

          <div className='flex justify-between flex-wrap mb-5'>
            <label className={`flex flex-col cursor-pointer border ${subscribeData.plan === 'monthly' ? 'border-task-ss-purple bg-task-ss-white-200' : 'border-task-ss-white-300'}  px-6 py-4 rounded-md w-full mb-4 transition-all md:w-[48%] hover:bg-task-ss-white-200`}>
              <div className='flex mb-1 justify-between'>
                <p className='text-xs'>Pay monthly</p>
                <input 
                    type='radio' 
                    value='monthly' 
                    name='plan' 
                    className='hidden'
                    checked={subscribeData.plan === 'monthly'} 
                    onChange={e => onChange(e)}  required 
                  />
              </div>
              <h3 className='font-medium'>₱300/month</h3>
            </label>

            <label className={`flex flex-col cursor-pointer border ${subscribeData.plan === 'yearly' ? 'border-task-ss-purple bg-task-ss-white-200' : 'border-task-ss-white-300'}  px-6 py-4 rounded-md w-full mb-4 transition-all md:w-[48%] hover:bg-task-ss-white-200`}>
              <div className='flex mb-1 justify-between'>
                <p className='text-xs'>Pay yearly</p>
                <input 
                    type='radio' 
                    value='yearly' 
                    name='plan' 
                    className='hidden'
                    checked={subscribeData.plan === 'yearly'} 
                    onChange={e => onChange(e)} required 
                  />
              </div>
              <h3 className='font-medium'>₱2,880/year</h3>
            </label> 
          </div>

          <div className='flex flex-col items-end'>
            <h1 className='mb-2 text-xl'>Billed now: {bill[subscribeData.plan]?.price}</h1>
            <p className='text-end text-xs'>You agree to be charged {bill[subscribeData.plan]?.price}, unless you <Link href='/user/dashboard' className='underline'>cancel</Link>. You acknowledge that refunds won't be available on cancellation.</p>
            
            <div className='flex gap-3'>
              <RegularButton 
                type='sndry'
                title='Cancel'
                link='/user/dashboard'
                m='my-4'
              />

              <RegularButton 
                type='pmry'
                title='Verify Payment'
                event={() => {
                  if(currentPlan) {
                    alert('Already Subscribed to a Plan!')
                  } else {
                    cnfrmPymntCloseHandler()
                  }
                }}
                m='my-4'
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmPayment
        isCnfrmPymntClosed={isCnfrmPymntClosed}
        cnfrmPymntCloseHandler={cnfrmPymntCloseHandler}
        subscribeData={subscribeData}
      />
    </div>
  )
}
 
export default Subscribe

Subscribe.getLayout = function PageLayout(page) {
    return (
      <GeneralLayout>
        <Head>
          <title>Subsribe to Pro Plan: Task SS</title>
        </Head>
        {page}
      </GeneralLayout>
    )
  }