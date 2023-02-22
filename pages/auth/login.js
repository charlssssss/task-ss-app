import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { ImGoogle3 } from 'react-icons/im'
import { BsFacebook } from 'react-icons/bs'
import GeneralLayout from '../../layouts/generalLayout'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  
  if (session && session.user.role == 1) {
    return {
      redirect: {
        destination: "/user/dashboard",
        permanent: false,
      }
    }
  }

  if (session && session.user.role == 2) {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      }
    }
  }

  return { props: {} }
}

const LogIn = () => {
  const router = useRouter()
  // credentials variables
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  console.log(username, password)

  // error variable
  const [isError, setIsError] = useState(false)

  // login function
  const handleLogin = async (e) => {
    e.preventDefault()
    await signIn('credentials', {
      username: username,
      password: password,
      redirect: false
    })
    .then(res => {
      if (res.ok) {
        router.push('/auth/login')
      }
      else {
        setIsError(true)
        //alert('Email and/or password is incorrect.')
      }
    })
  }

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className='flex rounded-2xl bg-task-ss-white-100 w-full max-w-[1000px] drop-shadow-lg md:w-[70%] lg:w-[60%]'>
        {/* left side panel */}
        <div className='bg-task-ss-dark-blue-300 w-[30%] rounded-l-2xl hidden lg:block xl:w-[40%]'>
          <Link href='/'>
            <img src='/task_ss_logo.png' className='absolute w-28 m-8'/>
          </Link>
          <img src='/login_bg_side_panel.png' className='rounded-l-2xl object-cover h-full'/>
        </div>
        {/* right side panel */}
        <div className='flex flex-col w-full py-10 px-14 lg:w-[70%] xl:w-[60%] xl:px-20'>
            {/* header */}
            <div className='mb-8'>
              <h1 className='font-bold text-2xl text-task-ss-dark-blue-400'>Welcome to Task SS!</h1>
              <h3 className='text-sm text-task-ss-white-400'>We are so excited to see you!</h3>
            </div>

            {/* other login options button */}
            <button className='px-10 py-2 mb-2 border rounded-full w-full bg-soc-med-facebook text-task-ss-white-100 border-soc-med-facebook'>
              <div className='flex items-center justify-center'>
                  <BsFacebook size={13} />
                  <p className='text-xs ml-2'>CONTINUE WITH FACEBOOK</p>
              </div>
            </button>

            <button className='px-10 py-2 mb-2 border rounded-full w-full bg-task-ss-white-100 text-soc-med-google border-soc-med-google transition-all hover:bg-soc-med-google hover:text-task-ss-white-100'>
              <div className='flex items-center justify-center'>
                  <ImGoogle3 size={13} />
                  <p className='text-xs ml-2'>CONTINUE WITH GOOGLE</p>
              </div>
            </button>

            {/* or section */}
            <div className='flex items-center mb-3'>
              <span className='bg-task-ss-white-300 w-full h-[1px]'></span>
              <p className='text-xs font-medium px-7'>OR</p>
              <span className='bg-task-ss-white-300 w-full h-[1px]'></span>
            </div>

            {/* error message */}
            <div 
              className={`flex relative justify-center rounded-md cursor-pointer bg-task-ss-red-100 ${isError ? 'flex' : 'hidden'}`}
            >
              <span className='absolute top-1 right-2 text-task-ss-red-200 text-xs' onClick={() => setIsError(!isError)} >x</span>
              <p className='text-xs py-2 text-task-ss-red-200'>Username and/or password is incorrect.</p>
            </div>

            {/* login form */}
            <form method="post" onSubmit={handleLogin}>
              <div className='flex flex-col my-2'>
                <label htmlFor='username' className='text-sm font-medium'>Username</label>
                <input type="text" id="username" required
                      className={`px-3 py-1 border outline-none border-soc-med-google rounded-md transition-all ${isError ? 'border-task-ss-red-200' : 'focus:border-task-ss-purple'}`}
                      name='username'
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className='flex flex-col my-2'>
                <label htmlFor='password' className='text-sm font-medium'>Password</label>
                <input type="password" id="password" required
                      className={`px-3 py-1 border outline-none border-soc-med-google rounded-md transition-all ${isError ? 'border-task-ss-red-200' : 'focus:border-task-ss-purple'}`}
                      name='password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                />
              </div>

              <p className='text-task-ss-purple text-xs underline'>Forgot your password?</p>

              <button 
                type='submit'
                className='bg-task-ss-purple text-task-ss-white-100 px-10 py-2 rounded-full w-auto mb-5 float-right'
              >
                <p className='text-xs'>Log In</p>
              </button>
            </form>

            <hr className='text-task-ss-white-300'/>

            <p className='text-xs font-medium text-center my-4'>Don't have an account?</p>

            {/* sign up button */}
            <Link href='/signup'>
              <button className='px-10 py-2 mb-2 border rounded-full w-full bg-task-ss-white-100 text-task-ss-purple border-task-ss-purple transition-all hover:bg-task-ss-purple hover:text-task-ss-white-100'>
                <p className='text-xs ml-2 align-middle'>SIGN UP FOR TASK SS</p>
              </button>
            </Link>
        </div>
      </div>
    </div>
  )
}
 
export default LogIn

LogIn.getLayout = function PageLayout(page) {
    return (
      <>
        <GeneralLayout>
          <Head>
            <title>Log In: Task SS</title>
          </Head>
          {page}
        </GeneralLayout>
      </>
    )
  }