import React from 'react';
import logo from "../assets/images/logo.svg";
import error404 from "../assets/images/error404.svg";
import Button from '@mui/material/Button'
const FourNotFound = () => {
    return (
        <>
            <div className='errorpage'>

                <img src={logo} alt="logo" className='logo_error' />
                <h1> 404, Page Not Found! </h1>
                <p> The page you requested could not be found. It may have been moved, renamed, or deleted.
                    Please double-check the URL or use the search function to find what you're looking for.</p>
                <img src={error404} alt="error404" className='error' />

                <a href="/"> Home</a>

            </div>
        </>
    )
}

export default FourNotFound