import axios from 'axios'

export function truncate(str, n) {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str
}

// fetcher function for useSWR hook
export const fetcher = ([url, token]) => 
    axios.get(url, { headers: { 'Authorization': 'Bearer ' + token } }).then(res => res.data)

export const handleDeleteCategory =  async (e, id, token, router, setDeleted) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure u want to delete category no.${id}?`) ) {
        const { data } = await axios(`http://127.0.0.1:8000/api/user/categories/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(data.success) {
            router.push('/user/categories')
            {setDeleted && setDeleted(id)}
            alert(data.message)
        } else { console.log(data.message) }
    }
}

export const handleDeleteTask =  async (e, id, token, url, router) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure u want to delete task no.${id}?`) ) {
        const { data } = await axios(`http://127.0.0.1:8000/api/user/tasks/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(data.success) {
            router.push(url)
            alert(data.message)
        } else { console.log(data.message) }
    }
}