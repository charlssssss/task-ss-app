import axios from 'axios'
import { mutate } from 'swr'; 

export function truncate(str, n) {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str
}

// fetcher function for useSWR hook
export const fetcher = ([url, token]) => 
    axios.get(url, { headers: { 'Authorization': 'Bearer ' + token } }).then(res => res.data)

export const handleDeleteCategory =  async (e, id, token, router) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure u want to delete category no.${id}?`) ) {
        await axios(`http://127.0.0.1:8000/api/user/categories/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => {
            if(res.data.success) {
                router.push('/user/categories')
                alert(res.data.message)
            } else { alert(res.data.message) }
        })
        .catch(error => {
            const errorMsg = JSON.parse(error.request.response)
            console.log(errorMsg.message)
            alert(errorMsg.message)
        })

        mutate('http://127.0.0.1:8000/api/user/categories')
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

        mutate('http://127.0.0.1:8000/api/user/tasks')
    }
}

export const handleDeleteWebsite =  async (e, id, token) => {
    e.preventDefault()
    // confirmation
    if(confirm(`Are you sure u want to delete website no.${id}?`) ) {
        const { data } = await axios(`http://127.0.0.1:8000/api/user/blockwebsites/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        if(data.success) {
            alert(data.message)
        } else { console.log(data.message) }

        mutate('http://127.0.0.1:8000/api/user/blockwebsites')
    }
}

export const handleEditWebsite =  async (e, web, token) => {
    e.preventDefault()
    const { data } = await axios(`http://127.0.0.1:8000/api/user/blockwebsites/${web.id}`, { 
        method: 'PUT',
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify({ 
            "website_name": web.website_name,
            "website_link": web.website_link,
            "is_include": !web.is_include
        }),
    })

    if(data.success) {
        alert(data.message)
    } else { console.log(data.message) }

    mutate('http://127.0.0.1:8000/api/user/blockwebsites')
}


export const isValidUrl = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
    return pattern.test(url)
}