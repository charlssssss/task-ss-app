import Head from "next/head"
import Link from "next/link"
import GeneralLayout from "../layouts/generalLayout"

const Custom404 = () => {
    return (
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='flex  justify-between max-w-[600px] h-auto -mt-10'>

          <div className='flex flex-col justify-center'>
            <Link href='/'>
              <img src='/task_ss_logo_dark.png' className='w-48 -ml-1 mb-6'/>
            </Link>
            
            <h1 className='text-md font-medium mb-6'>404. <span className='text-task-ss-white-400 font-normal'>That's an error.</span></h1>
            <h3 className='text-md'>The requested URL was not found on this server. <span className='text-task-ss-white-400'>That's all we know.</span></h3>
          </div>

          <img src='/illustration_3.png' className='w-64 hidden md:block'/>

        </div>
      </div>
    )
}
 
export default Custom404

Custom404.getLayout = function PageLayout(page) {
    return (
      <GeneralLayout>
        <Head>
          <title>Error 404: Not Found</title>
        </Head>
        {page}
      </GeneralLayout>
    )
  }