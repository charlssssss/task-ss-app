import PagesLayout from '../layouts/pagesLayout'
export default function Home() {
  return (
    <>
      {/* hero section */}
      <div className='w-screen h-auto flex flex-col items-center relative bg-task-ss-dark-blue-300'>
        <img src='/task_ss_logo_2.png' className='transition-all top-[25%] absolute w-[50%] lg:w-[700px]'/>
        <img src='/index_bg.png' />
      </div>

      {/* content section */}
      <div className='h-auto w-[90%] mx-auto py-20'>
        hello
      </div>
    </>
  )
}

Home.getLayout = function PageLayout(page) {
  return (
    <PagesLayout>
      {page}
    </PagesLayout>
  )
}
