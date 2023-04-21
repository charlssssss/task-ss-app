import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { FailedToLoad, Loading } from './errors'
import { fetcher } from '../functions'
   
// component for task list
const TableList = ({ api, sort }) => {
    const router = useRouter()

    const { data: session } = useSession()
    console.log('session', session)

    // fetch data
    const { data, error, isLoading } = useSWR([api, session?.user?.token], fetcher)

    
    // handle errors
    if (error) return <FailedToLoad />
    if (isLoading) return <Loading />
    
    console.log(data)
    return (
        <table className='tableitems-center  w-full border-collapse table-fixed '>
            <thead className='text-black font-medium shadow-sm w-full tracking-wide'>
                <tr>
                    <th className="px-6   tracking-wide border border-solid  py-3 text-xs  border-r-0 whitespace-nowrap font-semibold text-left">User ID</th>
                    <th className="px-6   tracking-wide border border-solid  py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Fist Name</th>
                    <th className="px-6   tracking-wide border border-solid  py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Last Name</th>
                    <th className="px-6   tracking-wide border border-solid  py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Email Address</th>
                    <th className="px-6   tracking-wide border border-solid  py-3 text-xs  border-l-0  whitespace-nowrap font-semibold text-left">Phone Number</th>
                </tr>
            </thead>
            {data.data.map((item, idx) => {

                if(item.role_id == sort) {
                    return (
                        <tr key={idx.toString()}
                        className='border border-gray-200  text-gray-600 hover:shadow-md hover:bg-blue-50 hover:font-medium hover:text-gray-700 hover:cursor-pointer'>
                            <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 overflow-hidden text-ellipsis'>{item.id}</td>
                            <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 overflow-hidden text-ellipsis'>{item.firstname}</td>
                            <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 overflow-hidden text-ellipsis'>{item.lastname}</td>
                            <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 overflow-hidden text-ellipsis'>{item.email}</td>
                            <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 overflow-hidden text-ellipsis'>{item.phone}</td>
                        </tr>
                    )
                }
            })}
        </table>
    )
}

export default TableList