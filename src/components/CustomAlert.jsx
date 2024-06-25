import React from 'react'

const CustomAlert = ({ variant, text, type, onClick }) => {
    return (
        <div className={`alert alert-${variant} alert-dismissible fade show w-50 mx-auto my-3`} role="alert">
            <strong>{type}</strong> {text}.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClick}></button>
        </div>
    )
}

export default CustomAlert