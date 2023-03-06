import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getCsrfToken } from 'next-auth/react'
import GeneralLayout from '../layouts/generalLayout'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

// get csrftoken
export const getServerSideProps = async (context) => {
  return { props: { csrfToken: await getCsrfToken(context) } }
}

const SignUp = () => {
  // for redirecting
  const router = useRouter()

  // credentials variables
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [cnfrmpassword, setCnfrmpassword] = useState('')
  const [viewPass, setViewPass] = useState(false)
  const [viewCnfrmPass, setViewCnfrmPass] = useState(false)

  // error variables
  const [errorMsg, setErrorMsg] = useState({})
  const [isError, setIsError] = useState(false)

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
        router.push('/login?signup=success')
      }
  }

  const signupInputsLeft = [
    {label: 'First Name', name: 'firstname', value: firstname, change: e => setFirstname(e.target.value)},
    {label: 'Last Name', name: 'lastname', value: lastname, change: e => setLastname(e.target.value)},
    {label: 'Email', name: 'email', value: email, change: e => setEmail(e.target.value)}
  ]
  const signupInputsRight = [
    {label: 'Phone Number', name: 'phone', value: phone, change: e => setPhone(e.target.value)},
    {label: 'Password', name: 'password', value: password, change: e => setPassword(e.target.value)},
    {label: 'Confirm Password', name: 'cnfrmpassword', value: cnfrmpassword, change: e => setCnfrmpassword(e.target.value)}
  ]
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
              <Link href='/login'>
                <button className='bg-task-ss-white-100 text-soc-med-google px-5 py-1 border border-soc-med-google rounded-full w-auto transition-all hover:bg-soc-med-google hover:text-task-ss-white-100'>
                    <p className='text-[10px]'>Login</p>
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
                {isError && (errorMsg.errors?.password?.length > 1 ? (
                  errorMsg?.errors?.password?.map((error, index) => (
                    <li key={index.toString()}
                        className={`text-[11px] ${errorMsg.success ? 'text-task-ss-green-200 ' : 'text-task-ss-red-200 '}`}
                    >
                      {error}
                    </li>
                  ))
                ) : null )}
              </ul>
            </div>

            {/* signup form */}
            <form method="post" onSubmit={handleSignup} className='mt-2'>
              {/* <input type='hidden' name='csrfToken' defaultValue={csrfToken} /> */}
              <div className='flex flex-col justify-between w-full lg:flex-row'>
                {/* left side inputs */}
                <div className='flex flex-col w-full lg:w-[49%]'>
                  {signupInputsLeft.map((input, idx) => (
                    <SignupInput
                      key={idx.toString()} 
                      label={input.label}
                      name={input.name}
                      value={input.value}
                      isError={isError}
                      errorMsg={errorMsg}
                      change={input.change}    
                    />
                  ))}
                </div>

                {/* right side inputs */}
                <div className='flex flex-col w-full lg:w-[49%]'>
                  <SignupInput
                    label='Phone Number'
                    name='phone'
                    value={phone}
                    isError={isError}
                    errorMsg={errorMsg}
                    change={e => setPhone(e.target.value)}    
                  />
                  <div className='flex flex-col my-2 h-16 relative'>
                    <label htmlFor='password' className='text-sm font-medium'>Password</label>
                    <input type={viewPass ? 'text' : 'password'} id="password"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${isError ? (errorMsg.errors?.password ? 'border-task-ss-red-200' : '') : (' input_pass focus:border-task-ss-purple')}`}
                          name='password'
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor='password' 
                          className={`absolute top-7 right-3 text-soc-med-google cursor-pointer ${isError ? (errorMsg.errors?.password ? 'text-task-ss-red-200' : '') : ('focus:text-task-ss-purple')}`} 
                          onClick={() => setViewPass(!viewPass)}
                    >
                      {viewPass ? <AiOutlineEye /> : <AiOutlineEyeInvisible /> }
                    </label>

                    {isError && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors?.password[0]}</p>}
                  </div>

                  <div className='flex flex-col my-2 h-16 relative'>
                    <label htmlFor='cnfrmpassword' className='text-sm font-medium'>Confirm Password</label>
                    <input type={viewCnfrmPass ? 'text' : 'password'} id="cnfrmpassword"
                          className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${(isError && errorMsg.errors) ? (errorMsg.errors.password ? 'border-task-ss-red-200' : '') : ('input_pass focus:border-task-ss-purple')}`}
                          name='cnfrmpassword'
                          value={cnfrmpassword}
                          onChange={e => setCnfrmpassword(e.target.value)}
                    />
                    <label htmlFor='cnfrmpassword' 
                          className={`absolute top-7 right-3 text-soc-med-google cursor-pointer ${isError ? (errorMsg.errors?.password ? 'text-task-ss-red-200' : '') : ('focus:text-task-ss-purple')}`} 
                          onClick={() => setViewCnfrmPass(!viewCnfrmPass)}
                    >
                      {viewCnfrmPass ? <AiOutlineEye /> : <AiOutlineEyeInvisible /> }
                    </label>
                  </div>
                </div>
              </div>

              <p className='text-[10px] text-task-ss-white-400'>By Signing up, you confirm that you accept our <Link href='/#' className='text-task-ss-purple underline'>Term of use.</Link></p>

              <button 
                type='submit'
                className='bg-task-ss-purple text-task-ss-white-100 px-10 py-2 rounded-full w-auto mb-5 float-right'
              >
                <p className='text-xs'>Signup</p>
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export const SignupInput = ({label, name, value, isError, errorMsg, change }) => {
  return (
    <div className='flex flex-col my-2 h-16'>
      <label htmlFor={name} className='text-sm font-medium'>{label}</label>
      <input type="text" id={name}
            className={`px-3 py-1 outline-none transition-all border border-soc-med-google rounded-md ${isError ? (errorMsg.errors?.[name] ? 'border-task-ss-red-200' : '') : ('focus:border-task-ss-purple')}`}
            name={name}
            value={value}
            onChange={change}
      />
      {isError && <p className='text-xs text-task-ss-red-200'>{errorMsg.errors?.[name]}</p>}
    </div>
  )
}

export default SignUp

SignUp.getLayout = function PageLayout(page) {
  return (
    <>
      <GeneralLayout>
        <Head>
          <title>Signup: Task SS</title>
        </Head>
        {page}
      </GeneralLayout>
    </>
  )
}