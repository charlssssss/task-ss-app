import { FaBars } from 'react-icons/fa'
import { ImHome } from 'react-icons/im'
import { BsBellFill } from 'react-icons/bs'
import { BsGearFill } from 'react-icons/bs'
import { GrAdd } from 'react-icons/gr'
import { IconButton } from './buttons'

// component for top bar
const Topbar = ({ toggleHandler }) => {
    return (
        <div className='bg-task-ss-white-100 flex items-center w-full h-14'>
            <div className='mx-8 w-screen'>
                <div className='flex justify-between'>
                    <div>
                        <IconButton 
                            icon={<FaBars className='text-task-ss-dark-blue-300' size={18} />} 
                            hover={true}
                            event={toggleHandler}
                        />
                        <IconButton 
                            icon={<ImHome className='text-task-ss-dark-blue-300' size={18} />}
                            link='/user/inbox'
                            hover={true}
                        />
                    </div>
                    
                    <div>
                        <IconButton 
                            icon={<GrAdd className='text-task-ss-dark-blue-300' size={18} />}
                            event={null}
                            hover={true}
                        />
                        <IconButton 
                            icon={<BsBellFill className='text-task-ss-dark-blue-300' size={18} />}
                            event={null}
                            hover={true}
                        />
                        <IconButton 
                            icon={<BsGearFill className='text-task-ss-dark-blue-300 ' size={18} />}
                            event={null}
                            hover={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Topbar