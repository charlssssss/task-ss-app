import axios from "axios"
import { capFirst } from "../functions"
import { RegularButton } from "./buttons"
import { useRouter } from "next/router"

const bill = {
    'monthly': { price: '500', quantity: '1', subId: '1' },
    'yearly': { price: '450', quantity: '12', subId: '2' }, 
}

const ConfirmPayment = ({ isCnfrmPymntClosed, cnfrmPymntCloseHandler, subscribeData }) => {
    const router = useRouter()
    console.log(subscribeData.token)

    const total = parseInt(bill[subscribeData.plan].price) * parseInt(bill[subscribeData.plan].quantity)

    const handleSubscribe = async (e) => {
        e.preventDefault()
        await axios('http://127.0.0.1:8000/api/user/subscribe', {
          method: 'POST',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + subscribeData.token
          
          },
          data: JSON.stringify({
            "subscription_type_id": bill[subscribeData.plan].subId
          })
        })
        .then(res => {
          if(res.data.success) {
              router.push('/user/dashboard')
              alert(res.data.message)
          } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error?.response?.data?.message)
            console.log(error)
            alert(error?.response?.data?.message)
        })
    }

    return (
        <div 
            className={`justify-center items-center absolute top-0 left-0 w-screen h-screen bg-task-ss-dark-blue-600 bg-opacity-50 z-20 ${isCnfrmPymntClosed ? ' hidden ' : ' flex '}`} 
        >
            <div className='w-[70%] lg:w-[500px] bg-task-ss-white-100 mx-auto drop-shadow-lg rounded-lg overflow-hidden flex flex-col px-7 py-6'>
                <div className='flex justify-center sm:justify-between items-center bg-task-ss-white-200 p-5 rounded-md'>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                    <p className='text-xs'>Subscription Summary:</p>
                    <h1 className='font-bold text-lg'>Task SS Pro Plan ({capFirst(subscribeData.plan)})</h1>
                    <p className='text-sm'>₱{bill[subscribeData.plan].price} per month</p>
                    </div>

                    <hr className='text-task-ss-white-400 opacity-50' />

                    <div className='text-xs flex gap-14 text-task-ss-white-500'>
                    <div className='flex flex-col gap-1'>
                        <p>{bill[subscribeData.plan].quantity} Month(s)</p>
                        <p className='text-sm font-semibold'>₱{total.toLocaleString()}.00</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p>Quantity</p>
                        <p className='text-sm'>Total</p>
                    </div>
                    </div>
                </div>

                <img src='/illustration_3.png' className='h-32 hidden sm:block'/>
                </div>
                
                <div className='mt-5 flex flex-col'>
                    <div className='flex flex-col items-center sm:items-start gap-2 text-center sm:text-start'>
                        <div className='flex justify-between flex-col sm:flex-row sm:gap-3 text-sm'>
                        <p>Full Name</p>
                        <p className='font-semibold'>{subscribeData.fullName}</p>
                        </div>
                        
                        <div className='flex justify-between flex-col sm:flex-row sm:gap-3 text-sm'>
                        <p>Email Address</p>
                        <p className='font-semibold'>{subscribeData.email}</p>
                        </div>

                        <div className='flex justify-between flex-col sm:flex-row sm:gap-3 text-sm'>
                        <p>Payment Method</p>
                        <p className='font-semibold'>VISA {subscribeData.cardNo.replace(/\d(?=\d{4})/g, "*")}</p>
                        </div>
                    </div>

                    <RegularButton
                        type='pmry'
                        title='Confirm Payment'
                        event={handleSubscribe}
                        m='mt-6'
                    />

                    <RegularButton
                        type='sndry'
                        title='Cancel'
                        m='mt-2'
                        event={cnfrmPymntCloseHandler}
                    />
                </div>
            </div>
        </div>
    )
}
 
export default ConfirmPayment