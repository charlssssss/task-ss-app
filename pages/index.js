import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Task SS</title>
      </Head>
      <Link href="/user/categories/" className='text-sm'>Category</Link>
    </>
  )
}

Home.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
