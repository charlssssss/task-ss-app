import Head from 'next/head'
import { BsCheck } from 'react-icons/bs'
import { getSession, useSession } from 'next-auth/react'
import PagesLayout from '../../layouts/pagesLayout'
import { RegularButton } from "../../components/user/buttons"
import axios from 'axios'

export const getServerSideProps = async (context) => {
  const res = await getSession(context)
  try {
      const[currentPlan] = await Promise.all([
          axios.get('http://localhost:8000/api/user/subscriptions/currentplan', 
          { headers: { 'Authorization': 'Bearer ' + res.user.token } }),
      ])
      return { 
          props: { currentPlan: currentPlan.data.data } 
      }
  
  } catch (error) {
      console.log(error)
      return { props: { currentPlan: null } }
  }
}

const pricingCardOptions = [
  {
    title: {
      img: 'illustration_1.png',
      header: 'Free',
      sub: 'For starters',
      price: '₱0'
    },
    btn: {
      type: 'snd',
      title: 'Current Plan'
    },
    list: [
      '5 free categories',
      'Productivity reports',
      'Notifications without pop-ups',
      'Alerts for potential conflict schedules'
    ]
  },
  {
    title: {
      img: 'illustration_2.png',
      header: 'Pro',
      sub: 'For pro users',
      price: '₱300'
    },
    btn: {
      type: 'pmry',
      title: 'Subscribe'
    },
    list: [
      'Unlimited categories',
      'Website Blocker',
      'Recurring Tasks',
    ]
  },
]

const Pricing = ({ currentPlan }) => {
  const { data: session } = useSession()

    return (
      <div className='w-[90%] mx-auto'>
        <div className='flex flex-wrap justify-center w-[90%] py-10 max-w-5xl mx-auto'>
          {pricingCardOptions.map((option, idx) => (
            <PricingCard 
              key={idx.toString()}
              title={option.title}
              btn={option.btn} 
              list={option.list}
              session={session}
              currentPlan={currentPlan}
            />
          ))}
        </div>
      </div>
    )
}

export const PricingCard = ({title, btn, list, session, currentPlan }) => {
  return (
    <div className='w-[80%] lg:w-[40%] bg-task-ss-white-100 rounded-xl h-auto mx-5 mb-10 drop-shadow-lg flex flex-col items-center py-10 px-20 transition-all lg:hover:drop-shadow-2xl'>

      <div className='flex flex-col items-center my-5'>
        <img src={title.img} className='w-40 mb-5' />
        <h1 className='text-2xl font-semibold'>{title.header}</h1>
        <h3 className='text-task-ss-white-400'>{title.sub}</h3>
        <h3 className='text-[60px] font-light'>{title.price}</h3>
      </div>

      {title.header == 'Free' ? 
        (session ? 
          (!currentPlan ?
            <RegularButton type={btn.type} title={btn.title} m='mb-5' link='/user/dashboard' />
          :
          <RegularButton type='pmry' title='Free Plan' m='mb-5' link='/user/dashboard' />
          )
        :
          <RegularButton type='pmry' title='Get Started' m='mb-5' link='/user/dashboard' />
        )
      :
        (session ? 
          (!currentPlan ?
            <RegularButton type={btn.type} title={btn.title} m='mb-5' link='/pricing/subscribe' />
          :
            <RegularButton type='snd' title='Current Plan' m='mb-5' link='/user/dashboard' />
          )
        :
          <RegularButton type={btn.type} title={btn.title} m='mb-5' link='/pricing/subscribe' />
        )
      }
      

      <span className='bg-task-ss-white-300 w-full mt-10 mb-3 h-[1px]'></span>

      <ul className='my-5 font-light self-start'>
        {list.map((item, idx) => (
          <li key={idx.toString()} className='mb-3 flex'><BsCheck size={20} className='mr-2 text-task-ss-green-200' />{item}</li>
        ))}
      </ul>

    </div>
  )
}

export default Pricing

Pricing.getLayout = function PageLayout(page) {
  return (
    <PagesLayout>
      <Head>
        <title>Pricing: Task SS</title>
      </Head>
      {page}
    </PagesLayout>
    )
  }