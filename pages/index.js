import TopNavbar from '../components/user/topnavbar'
import GeneralLayout from '../layouts/generalLayout'
export default function Home() {
  return (
    <>
      <TopNavbar />
      {/* hero section */}
      <div className='w-screen h-screen flex justify-center items-center'>
        <img src='/task_ss_logo_2.png' className='transition-all w-[50%] lg:w-[700px]'/>
        <img src='/index_bg.png' className='absolute top-0 w-screen h-screen -z-20'/>
        <div className='w-screen h-screen bg-task-ss-dark-blue-300 absolute -z-30'></div>
      </div>
    </>
  )
}

Home.getLayout = function PageLayout(page) {
  return (
        <GeneralLayout>
          {page}
        </GeneralLayout>
  )
}
