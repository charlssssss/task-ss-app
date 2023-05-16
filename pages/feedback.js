import { useState } from 'react'
import PagesLayout from '../layouts/pagesLayout'
import { getSession, useSession } from 'next-auth/react'
import { RegularButton } from '../components/user/buttons'
import FeedbackList from '../components/user/feedbacklist'
import AddFeedback from '../components/user/addfeedback'
import axios from 'axios'

export const getServerSideProps = async () => {
  try {
      const[feedbacks] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks/all`),
      ])
      return { 
          props: { 
            feedbacks: feedbacks.data.data.data
          } 
      }
  
  } catch (error) {
      console.log(error)
      return { props: { feedbacks: null }  }
  }
}

const Feedback = ({ feedbacks }) => {
  console.log(feedbacks)
  
  const { data: session } = useSession()
  let userToken
  if(session) { userToken = session.user.token }

  const [isFeedbackMdlClosed, setIsFeedbackMdlClosed] = useState(true)
  const feedbackMdlCloseHandler = () => setIsFeedbackMdlClosed(!isFeedbackMdlClosed)
  
  const overallRating = feedbacks.reduce((acc, feedback) => acc + parseInt(feedback.ratings), 0) / feedbacks.length

  const counts = feedbacks.reduce((acc, feedback) => {
    acc[feedback.ratings] = (acc[feedback.ratings] || 0) + 1
    return acc
  }, {})

  const percentages = Object.keys(counts).reduce((acc, rating) => {
    const count = counts[rating]
    const percentage = count / feedbacks.length * 100
    acc[rating] = percentage + "%"
    return acc
  }, {});

  console.log("hello", counts)
  console.log("hello", percentages)

  return (
    <>
      <div className='w-screen relative overflow-hidden'>
        <div className='w-[70%] mx-auto py-20 text-task-ss-white-100'>
          <img src='/task_ss_logo_2.png' className='w-[300px] mx-auto md:mx-0'/>

          <div className='flex justify-between items-center flex-col md:flex-row gap-4 mt-5 ml-2'>
            <div className='flex text-xs gap-3 font-extralight'>
              <p>{`${feedbacks.length} ${feedbacks.length > 1 ? 'Reviews' : 'Review'}`}</p>
              <p>2K Active Users</p>
            </div>

            <RegularButton
              type='pmry'
              title='Start Now'
              link='/user/dashboard'
            />
          </div>

          <img src='/index_bg.png' className='absolute top-0 left-0 -z-10' />
          <div className='absolute top-0 left-0 bg-task-ss-dark-blue-300 h-screen w-screen -z-20'></div>
        </div> 
      </div>

      <div className='w-[90%] mx-auto'>
        <div className='flex flex-wrap justify-center w-[90%] py-10 max-w-5xl mx-auto'>
          <div className='w-full py-4'>
            <div className='flex flex-col gap-8'>
              <div className='flex justify-between items-center'>
                <h2 className='text-3xl font-medium'>Feedback and Ratings</h2>

                <RegularButton
                  type='pmry'
                  title='Send us Feeback'
                  event={() => {
                    if(session) {
                      feedbackMdlCloseHandler()
                    } else {
                      alert("Please login first before sending us feedback. Thank you!")
                    }
                  }}
                />
              </div>

              <div className='flex gap-10'>
                <div className='flex flex-col items-center'>
                  <h2 className='text-[70px] font-medium'>{overallRating.toFixed(1)}</h2>
                  <p className='mt-[-15px]'>{`${feedbacks.length} ${feedbacks.length > 1 ? 'Reviews' : 'Review'}`}</p>
                </div>
                
                <div className='flex flex-col gap-2 justify-center w-full'>
                  <div className='flex items-center gap-3'>
                    <p className='text-xs'>5</p>
                    <div
                      style={{"--b-width" : percentages[5] }} 
                      className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[5] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                    ></div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <p className='text-xs'>4</p>
                    <div
                      style={{"--b-width" : percentages[4] }} 
                      className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[4] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                    ></div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <p className='text-xs'>3</p>
                    <div
                      style={{"--b-width" : percentages[3] }} 
                      className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[3] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                    ></div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <p className='text-xs'>2</p>
                    <div
                      style={{"--b-width" : percentages[2] }} 
                      className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[2] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                    ></div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <p className='text-xs'>1</p>
                    <div
                      style={{"--b-width" : percentages[1] }} 
                      className={`bg-task-ss-dark-blue-200 rounded-sm h-3 ${percentages[1] ? ' w-[var(--b-width)] ' : 'w-[1%]'}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <hr className='border border-task-ss-white-300 my-10' />

            <FeedbackList
              api={`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedbacks/all`}
              token={userToken}
              url='feedback'
              userId={session?.user?.id}
            />
          </div>
        </div>
      </div>

      <AddFeedback
        isFeedbackMdlClosed={isFeedbackMdlClosed}
        feedbackMdlCloseHandler={feedbackMdlCloseHandler}
      />
    </>
  )
}

export default Feedback

Feedback.getLayout = function PageLayout(page) {
  return (
    <PagesLayout>
      {page}
    </PagesLayout>
  )
}
