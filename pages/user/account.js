import GeneralLayout from '../../layouts/generalLayout'
import Head from 'next/head'
import { useSession, signOut, getSession } from "next-auth/react"
import TitleHeader from '../../components/user/titleheader'
import { RegularInput } from '../../components/user/inputs'
import { useEffect, useState } from 'react'
import { RegularButton } from '../../components/user/buttons'
import axios from 'axios'
import { useRouter } from 'next/router'

export const getServerSideProps = async (context) => {
  const res = await getSession(context)
  const { data } = await axios.get(`http://localhost:8000/api/user/profile`, 
      { headers: { 'Authorization': 'Bearer ' + res.user.token } })

  if(!data) {
      return { notFound: true }
  } 
  return { props: { user: data.data, userToken: res.user.token } }
}

const Account = ({ user, userToken }) => {
  const router = useRouter()

    // credentials variables
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
      setFirstname(user?.firstname)
      setLastname(user?.lastname)
      setPhone(user?.phone)
    }, [user])

    // add category function
    const handleEditUser =  async (e) => {
      e.preventDefault()
      const { data } = await axios(`http://127.0.0.1:8000/api/user/profile`, { 
          method: 'PATCH',
          headers: {
              'Accept': 'application/json', 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userToken
          },
          data: JSON.stringify({ 
              "firstname" : firstname,
              "lastname" : lastname,
              "phone" : phone
          }),
      })

      if(data.success) {
          router.push('/user/dashboard')
          alert(data.message)
      } else { alert(data.message) }
  }

  const handleDeleteUser =  async (e) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure u want to deactivate ${user?.firstname}?`) ) {
        await axios(`http://127.0.0.1:8000/api/user/deleteUser/${user.id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + userToken }
        })
        .then(res => {
            if(res.data.success) {
                signOut({ redirect: false })
                router.push('/')
                alert(res.data.message)
            } else { alert(res.data.message) }
        })
        .catch(error => {
            console.log(error)
            alert(error)
        })
    }
  }

  return (
    <div className='h-screen w-screen overflow-y-auto pb-10'>
        <div className='w-[70%] mx-auto py-20'>
          <TitleHeader title='Account Settings' />

          <form onSubmit={handleEditUser}>
            <RegularInput
              name='firstname'
              title='First Name'
              value={firstname}
              change={setFirstname}
              placeholder='First Name'
              m='mb-5'
            />
            
            <RegularInput
              name='lastname'
              title='Last Name'
              value={lastname}
              change={setLastname}
              placeholder='Last Name'
              m='mb-5'
            />

            <RegularInput
              name='phone'
              title='Phone Number'
              value={phone}
              change={setPhone}
              placeholder='Phone Number'
              m='mb-5'
            />
            
            <div className='flex justify-between'>
              <RegularButton
                type='dngr'
                title='Deactivate'
                event={handleDeleteUser}
              />

              <div className='flex gap-5'>
                <RegularButton
                  type='sndry'
                  title='Cancel'
                  link='/user/dashboard'
                />

                <RegularButton
                  type='pmry'
                  title='Save Changes'
                />
              </div>
            </div>
          </form>
        </div>
    </div>
  )
}
 
export default Account

Account.getLayout = function PageLayout(page) {
    return (
      <GeneralLayout>
        <Head>
          <title>Account: Task SS</title>
        </Head>
        {page}
      </GeneralLayout>
    )
  }