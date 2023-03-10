import Head from 'next/head'
import { useState } from 'react'
import { Rubik } from '@next/font/google'
import Topbar from "../components/user/topbar"
import SideNavbar from "../components/user/sidenavbar"
import AddCategory from '../components/user/addcategory'
import AddTask from '../components/user/addtask'

// If loading a variable font, you don't need to specify the font weight
const rubik = Rubik({ subsets: ['latin'] })

const AppLayout = ({ children }) => {
    // frontend variables
    const [isToggled, setIsToggled] = useState(false)
    const toggleHandler = () => setIsToggled(!isToggled)

    // add category modal
    const [isCatMdlClosed, setIsCatMdlClosed] = useState(true)
    const catMdlCloseHandler = () => setIsCatMdlClosed(!isCatMdlClosed)

    // add task modal
    const [isTaskMdlClosed, setIsTaskMdlClosed] = useState(true)
    const taskMdlCloseHandler = () => setIsTaskMdlClosed(!isTaskMdlClosed)
    const [taskType, setTaskType] = useState('')

    return (
        <>
            <Head>
                <title>Task SS</title>
                <meta name="description" content="Task SS: A Smart Scheduler and Task Manager Application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={rubik.className}>
                <div className='flex w-screen h-screen'>
                <SideNavbar 
                    isToggled={isToggled} 
                    toggleHandler={toggleHandler} 
                    catMdlCloseHandler={catMdlCloseHandler} 
                />
                <div className={`w-full transition-all ${isToggled ? null : 'lg:w-[calc(100%-20rem)]' }`} >
                    <Topbar 
                        toggleHandler={toggleHandler} 
                        taskMdlCloseHandler={taskMdlCloseHandler} 
                        setTaskType={setTaskType}
                    />
                    <div className='h-[calc(100vh-3.5rem)] overflow-y-auto'>
                        <main className='container mx-auto px-10 py-5 lg:px-32 lg:py-14 '>
                        {children}
                        </main>
                    </div>
                </div>
                </div>
                <AddCategory 
                    isCatMdlClosed={isCatMdlClosed} 
                    catMdlCloseHandler={catMdlCloseHandler} 
                />
                <AddTask 
                    isTaskMdlClosed={isTaskMdlClosed} 
                    taskMdlCloseHandler={taskMdlCloseHandler} 
                    taskType={taskType}
                    setTaskType={setTaskType}
                />
            </div>
        </>
    )
    
}
 
export default AppLayout