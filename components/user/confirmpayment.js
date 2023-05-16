import axios from "axios"
import { capFirst } from "../functions"
import { RegularButton } from "./buttons"
import { useRouter } from "next/router"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useSession } from "next-auth/react"

const bill = {
    'monthly': { price: '300.00', quantity: '1', subId: '1' },
    'yearly': { price: '240.00', quantity: '12', subId: '2' }, 
}

const ConfirmPayment = ({ isCnfrmPymntClosed, cnfrmPymntCloseHandler, subscribeData }) => {
    const router = useRouter()
    console.log(subscribeData.plan)

    const { data: session } = useSession()
    let userToken
    if(session) { userToken = session.user.token }

    const total = parseInt(bill[subscribeData.plan].price) * parseInt(bill[subscribeData.plan].quantity)

    const handleSubscribe = async () => {
        await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/subscriptions/subscribe`, {
          method: 'POST',
          headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
          
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

    const clientId = "AYBVKmEXoo9m7JWgyEruUjSJ3UoQcS3Yu1kseK1WKh8v0-VoJGXaPocao6OPEMi3U-IH3hdHtSTOHrEd"

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
            {
                amount: {
                    value: bill[subscribeData.plan].price,
                },
            },
            ],
        })
    }
    
    const onApprove = (data, actions) => {
      return actions.order.capture().then((details) => {
        console.log(details)
        handleSubscribe()
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
                    <div className='flex flex-col items-center sm:items-start gap-2 text-center sm:text-start mb-5'>
                        <div className='flex justify-between flex-col sm:flex-row sm:gap-3 text-sm'>
                        <p>Full Name</p>
                        <p className='font-semibold'>{subscribeData.fullName}</p>
                        </div>
                        
                        <div className='flex justify-between flex-col sm:flex-row sm:gap-3 text-sm'>
                        <p>Email Address</p>
                        <p className='font-semibold'>{subscribeData.email}</p>
                        </div>
                    </div>

                    <PayPalScriptProvider options={{ "client-id": clientId }}>
                        <PayPalButtons style={{ layout: "vertical" }} createOrder={createOrder} onApprove={onApprove} />
                    </PayPalScriptProvider>

                    <RegularButton
                        type='sndry'
                        title='Cancel'
                        event={cnfrmPymntCloseHandler}
                    />
                </div>
            </div>
        </div>
    )
}
 
export default ConfirmPayment