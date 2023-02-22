import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getCsrfToken } from 'next-auth/react'
import GeneralLayout from '../layouts/generalLayout'

export const getServerSideProps = async (context) => {
  return {
    props: { csrfToken: await getCsrfToken(context) }
  };
}

const SignUp = () => {
  const router = useRouter()
  // console.log(csrfToken)
  // credentials variables
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [cnfrmpassword, setCnfrmpassword] = useState('')

  // error variables
  const [errorMsg, setErrorMsg] = useState({})
  const [isError, setIsError] = useState(false)

  console.log(firstname, lastname, email, phone, password, cnfrmpassword)

  // signup function
  const handleSignup = async (e) => {
    e.preventDefault()
    const res = await fetch('http://127.0.0.1:8000/api/user/auth/register', {
          method: 'POST',
          headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ 
            role_id: 1,
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password,
            password_confirmation: cnfrmpassword,
          }),
      })

      const data = await res.json()
      setErrorMsg(data)
      setIsError(true)

      if(data.success) {
        router.push('/auth/login?signup=success')
      }
  }
  console.log(errorMsg)
  return (
    <div className='flex justify-center items-center w-screen h-screen overflow-y-auto'>
      
      <div className='flex rounded-2xl bg-task-ss-white-100 w-full max-w-[1000px] drop-shadow-lg md:w-[90%] lg:w-[80%]'>
        {/* left side panel */}
        <div className='bg-task-ss-dark-blue-300 rounded-l-2xl hidden lg:block lg:w-[20%]'>
        <Link href='/'>
          <img src='/task_ss_logo.png' className='absolute w-28 m-8 scale-0 xl:scale-100'/>
        </Link>
          <img src='/login_bg_side_panel.png' className='rounded-l-2xl object-cover h-full'/>
        </div>
        {/* right side panel */}
        <div className='flex flex-col w-full py-10 px-14 lg:w-[90%] xl:w-[80%] xl:px-20'>
            {/* login button */}
            <div className='flex justify-end items-center mb-4'>
              <p className='text-[10px] text-task-ss-white-400 mr-2'>Already have an account?</p>
              <Link href='/auth/login'>
                <button className='bg-task-ss-white-100 text-soc-med-google px-5 py-1 border border-soc-med-google rounded-full w-auto transition-all hover:bg-soc-med-google hover:text-task-ss-white-100'>
                    <p className='text-[10px]'>Log in</p>
                </button>
              </Link>
            </div>

            {/* header */}
            <div className='mb-4'>
              <h1 className='font-bold text-2xl text-task-ss-dark-blue-400'>Create an Account.</h1>
              <h3 className='text-sm text-task-ss-white-400'>Enter login information for your account.</h3>
            </div>

            {/* error message */}
            <div 
              className={`flex-col relative justify-center rounded-md py-2 px-4 ${errorMsg.success ? 'bg-task-ss-green-100 ' : 'bg-task-ss-red-100 '} ${isError ? 'flex' : 'hidden'}`}
            >
              <span className={`absolute top-1 right-2 cursor-pointer text-xs  ${errorMsg.success ? 'text-task-ss-green-200 ' : 'text-task-ss-red-200 '}`} onClick={() => setIsError(!isError)} >x</span>

              <p className={`text-[11px] ${errorMsg.success ? 'text-task-ss-green-200 ' : 'text-task-ss-red-200 '}`} >{isError && errorMsg.message}</p>
              
              <ul className='list-disc ml-3'>
                {(isError && errorMsg.errors) && (errorMsg.errors.password ? ((errorMsg.errors.password.length > 1 ? (
                  errorMsg.errors.password.map((error, index) => (
                    <li key={index.toString()}
                        className={`text-[11px] ${errorMsg.success ? 'text-task-ss-green-200 ' : 'text-task-ss-red-200 '}`}
                    >
                      {error}
                    </li>
                  ))
                ) : null )) : null)}
              </ul>
            </div>

            {/* signup form */}
            <form method="post" onSubmit={handleSignup} className='mt-2'>
              {/* <input type='hidden' name='csrfToken' defaultValue={csrfToken} /> */}
              <div className='flex flex-col justify-between w-full lg:flex-row'>
                {/* left side inputs */}
                <div className='flex flex-col w-full lg:w-[49%]'>
                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='firstname' className='text-sm font-medium'>First Name</label>
                    <input type="text" id="firstname"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.firstname ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='firstname'
                          value={firstname}
                          onChange={e => setFirstname(e.target.value)}
                    />
                    {(isError && errorMsg.errors) && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors.firstname}</p>}
                  </div>

                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='lastname' className='text-sm font-medium'>Last Name</label>
                    <input type="text" id="lastname"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.lastname ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='lastname'
                          value={lastname}
                          onChange={e => setLastname(e.target.value)}
                    />
                    {(isError && errorMsg.errors) && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors.lastname}</p>}
                  </div>

                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='email' className='text-sm font-medium'>Email</label>
                    <input type="text" id="email"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.email ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='email'
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                    />
                    {(isError && errorMsg.errors) && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors.email}</p>}
                  </div>
                </div>

                {/* right side inputs */}
                <div className='flex flex-col w-full lg:w-[49%]'>
                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='phone' className='text-sm font-medium'>Phone Number</label>
                    <input type="text" id="phone"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.phone ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='phone'
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                    />
                    {(isError && errorMsg.errors) && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors.phone}</p>}
                  </div>

                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='password' className='text-sm font-medium'>Password</label>
                    <input type="password" id="password"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.password ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='password'
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                    />
                    {(isError && errorMsg.errors) && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors.password[0]}</p>}
                  </div>

                  <div className='flex flex-col my-2 h-16'>
                    <label htmlFor='cnfrmpassword' className='text-sm font-medium'>Confirm Password</label>
                    <input type="password" id="cnfrmpassword"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.password ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
                          name='cnfrmpassword'
                          value={cnfrmpassword}
                          onChange={e => setCnfrmpassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <p className='text-[10px] text-task-ss-white-400'>By Signing up, you confirm that you accept our <Link href='/#' className='text-task-ss-purple underline'>Term of use.</Link></p>

              <button 
                type='submit'
                className='bg-task-ss-purple text-task-ss-white-100 px-10 py-2 rounded-full w-auto mb-5 float-right'
              >
                <p className='text-xs'>Sign Up</p>
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp

SignUp.getLayout = function PageLayout(page) {
  return (
    <>
      <GeneralLayout>
        <Head>
          <title>Sign Up: Task SS</title>
        </Head>
        {page}
      </GeneralLayout>
    </>
  )
}