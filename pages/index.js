import PagesLayout from '../layouts/pagesLayout'

const featureContent = [
  {
    color: 'bg-task-ss-white-100', 
    header: 'Manage your tasks',
    img: '/illustration_3.png', 
    content: 'Integer dapibus ex ac augue molestie iaculis. Donec vestibulum ligula ante, quis faucibus est tristique vitae. Pellentesque maximus sollicitudin odio, vel blandit neque. Duis consequat turpis vitae laoreet pulvinar. Interdum et malesuada fames ac ante ipsum primis in faucibus.'
  },
  {
    color: 'bg-task-ss-white-200', 
    header: 'Block from various distractions',
    img: '/illustration_4.png', 
    content: 'Cras elementum lobortis turpis, vel condimentum lorem vehicula sed. Cras congue mauris eget ornare efficitur. Praesent at finibus turpis. Donec vitae massa vitae enim mattis vestibulum. Sed faucibus ultricies varius. Quisque porttitor aliquet quam, at porta augue elementum rhoncus.'
  },
  {
    color: 'bg-task-ss-white-100', 
    header: 'Alert  possible conflict schedules',
    img: '/illustration_5.png', 
    content: 'Nam sodales ut arcu sit amet sodales. Nulla euismod est et felis luctus, sed venenatis est sodales. Nam semper ac leo ac tincidunt. Donec in sem sed elit luctus pulvinar. Nulla malesuada sem ac mattis auctor. Aliquam feugiat luctus ex. Donec a libero nisi.'
  },
  {
    color: 'bg-task-ss-white-200', 
    header: 'Helpful productivity reports',
    img: '/illustration_6.png', 
    content: 'Nam sodales ut arcu sit amet sodales. Nulla euismod est et felis luctus, sed venenatis est sodales. Nam semper ac leo ac tincidunt. Donec in sem sed elit luctus pulvinar. Nulla malesuada sem ac mattis auctor. Aliquam feugiat luctus ex. Donec a libero nisi.'
  }
]

const proponents = [
  {img: '/proponents/senpz.jpg', name: 'Kent Armelia', pos: 'CTO | Software Developer'},
  {img: '/proponents/bornz.jpg', name: 'Philip Gabriel Bornea', pos: 'CMO | UI Designer'},
  {img: '/proponents/charles.jpg', name: 'Charles John Cañete', pos: 'CEO | Project Manager'},
  {img: '/proponents/kaiser.jpg', name: 'James Kaiser Opina', pos: 'CBDO | QA Tester'},
  {img: '/proponents/chesterrr.jpg', name: 'Chester Ace Saagundo', pos: 'CFO | Database Designer'}
]
export default function Home() {
  return (
    <>
      {/* hero section */}
      <div className='w-screen h-auto flex flex-col items-center relative bg-task-ss-dark-blue-300'>
        <img src='/task_ss_logo_2.png' className='transition-all top-[25%] absolute w-[50%] lg:w-[700px]'/>
        <img src='/index_bg.png' />
      </div>

      {/* content section */}
      {featureContent.map((feat, idx) => (
        <FeatureSection
          key={idx.toString()} 
          color={feat.color}
          img={feat.img}
          featHeader={feat.header} 
          featContent={feat.content}
          flip={idx % 2 == 1}
        />
      ))}

      <IndexSection color='bg-task-ss-dark-blue-300'>
        {/* <h1 className='text-task-ss-white-100'>Meet the team behind Task SS</h1> */}
        <div className='flex flex-wrap text-task-ss-white-100 justify-center'>

          {proponents.map((prop, idx) => (
            <ProponentCard
            key={idx.toString()}
              img={prop.img}
              name={prop.name}
              pos={prop.pos}
            />
          ))}

        </div>
      </IndexSection>
    </>
  )
}

export const IndexSection = ({color, children}) => {
  return (
    <section className={`h-auto w-full py-40 ${color}`}>
      <div className='h-auto w-[70%] mx-auto'>
        {children}
      </div>
    </section>
  )
}

export const FeatureSection = ({color, img, featHeader, featContent, flip}) => {
  return (
    <section className={`h-auto w-full py-40 ${color}`}>
      <div className='h-auto w-[70%] mx-auto'>
        <div className={`flex ${flip ? 'flex-row-reverse' : ''} flex-wrap lg:flex-nowrap justify-center`}>
          <img src={img} className='w-48 mx-5 mb-5 lg:mb-0' />

          <div className='flex flex-col justify-center'>
            <h1 className='text-3xl font-medium mb-3 text-center lg:text-start'>{featHeader}</h1>
            <p className='text-lg text-center lg:text-start'>{featContent}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export const ProponentCard = ({img, name, pos}) => {
  return (
    <div className='flex flex-col items-center mx-4 mt-2 mb-4'>
      <div className='w-28 h-28 rounded-full overflow-hidden mb-2'>
        <img src={img} />
      </div>

      <h2 className='text-md font-medium'>{name}</h2>
      <p className='text-xs font-light'>{pos}</p>
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
