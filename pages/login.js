import Head from 'next/head'
import GeneralLayout from '../layouts/generalLayout'

const Login = () => {
    return (
      <div className='flex mx-auto rounded-2xl bg-task-ss-white-100 w-[60%] shadow-lg'>
        <div className='bg-task-ss-dark-blue-300 w-[40%] rounded-l-2xl'>
          <img src='/task_ss_logo.png' className='w-28 m-8'/>
        </div>
        <div className='flex-col w-[60%] py-10 px-24'>
            <h1 className='font-bold text-2xl text-task-ss-dark-blue-400'>Welcome to Task SS!</h1>
            <h3 className='text-sm text-task-ss-white-400'>We are so excited to see you!</h3>

            <button className='bg-soc-med-fb text-task-ss-white-100 px-10 py-2 rounded-full w-full'>
              <p className='text-xs'>CONTINUE WITH FACEBOOK</p>
            </button>
            <button className='bg-task-ss-white-100 text-soc-med-google border border-soc-med-google px-10 py-2 rounded-full w-full'>
              <p className='text-xs'>CONTINUE WITH GOOGLE</p>
            </button>

            <form>
              <div className='flex flex-col'>
                <label for='username' className='text-sm font-medium'>Username</label>
                <input type="text" id="username" required
                       className='px-3 py-1 border rounded-md'/>
              </div>
              <button className='bg-task-ss-purple text-task-ss-white-100 px-10 py-2 rounded-full w-auto'>
                <p className='text-xs'>Login</p>
              </button>
            </form>

            <p className='text-sm font-medium'>Don't have an account?</p>

            <button className='bg-task-ss-white-100 text-soc-med-google border border-soc-med-google px-10 py-2 rounded-full w-full'>
              <p className='text-xs'>SIGN UP FOR TASK SS</p>
            </button>
        </div>
      </div>
    )
}
 
export default Login

Login.getLayout = function PageLayout(page) {
    return (
      <>
        <GeneralLayout>
          <Head>
            <title>Login: Task SS</title>
          </Head>
          {page}
        </GeneralLayout>
      </>
    )
  }