// components for title header, (for consistent layout)
const TitleHeader = ({ title }) => {
    return (
        <div className='flex border-b border-b-task-ss-white-300 pb-4 mb-4'>
            <h3 className='text-2xl font-medium'>{title}</h3>
        </div>
    )
}
 
export default TitleHeader