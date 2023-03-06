import GeneralLayout from '../../layouts/generalLayout'
import Link from 'next/link'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { BsCheck } from 'react-icons/bs'
import { RegularButton } from '../../components/user/buttons'

const proList = [
  'Unlimited categories',
  'Website Blocker',
  'Notifications pop-ups',
  'Recurring Tasks',
  'Scheduled auto-generated links'
]

const Subscribe = () => {
  const { data: session } = useSession()
    let user
    if(session) { user = session.user }

  return (
    <div className='h-screen w-screen overflow-y-auto pb-10'>
      <div className='flex items-center w-full h-14 mt-4 mb-14'>
        <div className='flex flex-col mx-14 w-screen'>
          <div className='flex justify-between items-center'>
            <Link href='/'>
              <img src='/task_ss_logo_dark.png' className='h-8 w-auto'/>
            </Link>
            
            <div className='flex flex-col items-end'>
              <h3 className='text-lg font-semibold text-task-ss-dark-blue-300'>{`${user?.firstname} ${user?.lastname}`}</h3>
              <p className='text-xs text-task-ss-white-400'>{user?.email}</p>
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

          <div className='flex justify-between flex-wrap'>
            <label className='flex flex-col cursor-pointer border border-task-ss-white-300 px-6 py-4 rounded-md w-full mb-4 transition-all md:w-[48%] hover:bg-task-ss-white-200'>
              <div className='flex mb-1 justify-between'>
                <p className='text-xs'>Pay yearly</p>
                <input type='radio' value='yearly' name='plan' />
              </div>
              <h3 className='font-medium'>P450/month</h3>
            </label>

            <label className='flex flex-col cursor-pointer border border-task-ss-white-300 px-6 py-4 rounded-md w-full mb-4 transition-all md:w-[48%] hover:bg-task-ss-white-200'>
              <div className='flex mb-1 justify-between'>
                <p className='text-xs'>Pay monthly</p>
                <input type='radio' value='monthly' name='plan' />
              </div>
              <h3 className='font-medium'>P500/month</h3>
            </label>
          </div>

          <div className='flex flex-col mb-10'>
            <label htmlFor='card_details' className='mb-2'>Card details</label>
            <input type='text' id='card_details' name='card_details'
                  className='px-3 py-1 border outline-none transition-all border-task-ss-white-300 rounded-md focus:border-task-ss-purple'
            />
          </div>

          <div className='flex flex-col items-end'>
            <h1 className='mb-2 text-xl'>Billed now: P500</h1>
            <p className='text-end text-xs'>By clicking “Start Task SS Pro Plan”, you agree to be charged $500 every month, unless you cancel. You acknowledge that refunds won't be available on cancellation.</p>

            <RegularButton 
              type='pmry'
              title='Start Task SS Pro Plan'
              eventType='button'
              m='my-4'
            />

          </div>

        </div>
      </div>
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