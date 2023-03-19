import PagesLayout from '../layouts/pagesLayout'
export default function Home() {
  return (
    <div className='w-screen h-screen flex justify-center items-center overflow-hidden'>
      {/* hero section */}
      <img src='/task_ss_logo_2.png' className='transition-all w-[50%] lg:w-[700px]'/>
      <img src='/index_bg.png' className='absolute top-14 -z-20'/>
      <div className='w-screen h-screen bg-task-ss-dark-blue-300 absolute -z-30'></div>
    </div>
  )
}

Home.getLayout = function PageLayout(page) {
  return (
    <PagesLayout>
      {page}
    </PagesLayout>
  )
}
