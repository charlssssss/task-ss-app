import { useState } from 'react'
import PagesLayout from '../layouts/pagesLayout'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { RegularButton } from '../components/user/buttons'
import { RegularTextArea } from '../components/user/inputs'
import FeedbackList from '../components/user/feedbacklist'
import TitleHeader from '../components/user/titleheader'
import EditFeedback from '../components/user/editfeedback'

const Feedback = () => {
  const router = useRouter()
  const { data: session } = useSession()
  let userToken
  if(session) {
      userToken = session.user.token
  }

  const [comments, setComments] = useState('')
  const [ratings, setRatings] = useState('1')

  const handleAddFeedback = async (e) => {
    e.preventDefault()

    await axios('http://127.0.0.1:8000/api/user/feedbacks', { 
        method: 'POST',
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        },
        data: JSON.stringify({ 
            "comments"  : comments,
            "ratings" : ratings,
        }),
    })
    .then(res => {
        if(res.data.success) {
            router.push(`/feedback`)
            alert(res.data.message)
        } else { alert(res.data.message) }
    })
    .catch(error => {
        console.log(error)
    })
  }

  console.log(comments, ratings)
  return (
    <>
      <div className='bg-task-ss-dark-blue-300 w-screen'>
        <div className='w-[70%] mx-auto py-20 text-task-ss-white-100'>
          <h1 className='text-[50px]'>Task SS</h1>
          <p>A Smart Scheduler and Task <br/> ManagerApplication For College Students</p>
        </div> 
      </div>

      <div className='w-[90%] mx-auto'>
        <div className='flex flex-wrap justify-center w-[90%] py-10 max-w-5xl mx-auto'>
          <form 
            onSubmit={(e) => {
              handleAddFeedback(e)
              setComments('')
              setRatings('1')
            }}
            className='flex flex-col w-full mb-5'
          >
            <RegularTextArea
              name='comments'
              title='Your Feedback'
              value={comments}
              change={setComments}
              placeholder='Your comment here...'
              m=''
            />
            <select 
              name='ratings' 
              value={ratings} 
              onChange={(e) => setRatings(e.target.value)} 
              className='font-medium rounded-md text-xs py-2 pr-7 mb-2'
            >
              <option value='1'>1 Star</option>
              <option value='2'>2 Stars</option>
              <option value='3'>3 Stars</option>
              <option value='4'>4 Stars</option>
              <option value='5'>5 Stars</option>
            </select>

            <RegularButton
              type='pmry'
              title='Submit Feedback'
            />
          </form>
          
          <div className='w-full py-5'>
            <TitleHeader title='All Feedbacks and Ratings' />
          
            <FeedbackList
              api='http://localhost:8000/api/user/feedbacks'
              token={userToken}
              url='feedback'
            />
          </div>
        </div>
      </div>
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
