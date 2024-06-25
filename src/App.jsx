import React, { useEffect, useState } from 'react'
import CustomAlert from './components/CustomAlert'

const App = () => {

    const [names, setNames] = useState(null)
    const [name, setName] = useState("")
    const [message, setMessage] = useState(null)
    const [show, setShow] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        getNames('http://localhost:3000/names', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
    }, [])

    const getNames = (
        url = 'http://localhost:3000/names',
        options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
    ) => {
        fetch(url, options)
            .then((response) => {
                console.log(response.ok)
                if (response.status === 404) throw new Error("Pagina no encontrada")
                if (response.status === 401) throw new Error("No tiene permiso para ver esa informacion")
                return response.json()
            })
            .then((responseJson) => {
                console.log(responseJson)
                /* setMessage({
                    variant: 'info',
                    text: 'Nombres cargados correctamente',
                    type: 'Info'
                }) */
                setNames(responseJson)
            })
            .catch((error) => console.log(error))
    }

    const handleChange = e => {
        setName(e.target.value)
    }

    const saveName = () => {
        postName('http://localhost:3000/names', {
            method: 'POST',
            body: JSON.stringify({ name: name }),
            headers: { 'Content-Type': 'application/json' }
        })
        setName("")
    }

    const postName = (url, options) => {
        fetch(url, options)
            .then((response) => {
                //if(response.status === 201) getNames('http://localhost:3000/names')
                return response.json()
            })
            .then((responseJson) => {
                console.log(responseJson)
                setNames(prevState => [...prevState, responseJson])
                setMessage({
                    variant: 'success',
                    text: 'Nombre creado correctamente',
                    type: 'Success'
                })
            })
            .catch((error) => console.log(error))
    }

    const handleDelete = item => {
        const resp = confirm(`Desea Eliminar el item ${item.name}`)
        if(resp){
            deleteName(`http://localhost:3000/names/${item.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json'}})
        }
    }

    const deleteName = (url, options) => {
        fetch(url, options)
            .then((response) => {
                if(response.status === 200) {
                    getNames('http://localhost:3000/names')
                    setMessage({
                        variant: 'success',
                        text: 'Nombre eliminado correctamente',
                        type: 'Success'
                    })
                }
            })
    }

    return (
        <>

            <div className="d-flex w-50 mx-auto my-3 input-group">
                <input type="text" className="form-control" onChange={handleChange} value={name} placeholder='Insert Name' />
                <button className='btn btn-primary' onClick={saveName}>
                    <i className="bi bi-floppy"></i>
                </button>
            </div>

            <ul className="list-group w-50 mx-auto">
                <h3 className='badge bg-primary my-1 py-2 d-flex'>
                    <span>Names:</span>
                    <span className='ms-auto'><i className="bi bi-search" onClick={() => setShow(!show)}></i></span>
                </h3>
                {
                    show && (
                        <input type="search" placeholder='search...' className="form-control mb-3" value={search} onChange={(e) => setSearch(e.target.value)} />
                    )
                }
                {
                    !!names &&
                    Array.isArray(names) && names.length > 0 &&
                    names.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => {
                        return (
                            <li className='list-group-item list-group-item-action d-flex justify-content-between' key={item.id}>
                                <span>{item.name}</span>
                                <span><i className="bi bi-trash" onClick={() => handleDelete(item)}></i></span>
                            </li>
                        )
                    })
                }

            </ul>
            {
                !!message && (
                    <CustomAlert variant={message?.variant} text={message?.text} type={message?.type} onClick={() => setMessage(null)} />
                )
            }
        </>
    )
}

export default App