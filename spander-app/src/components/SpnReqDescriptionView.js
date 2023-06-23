import React from 'react';
import { Link } from 'react-router-dom';

const SpnReqDescriptionView = (props) => (
    <>
        <div className='description'>
            <h6 className='text-primary top_heading'>Description</h6>
            <div className='border  p-3'>
                <p className='text-600'>This repository contains both human-readable and machine-readable documentation about the Lottie format
                </p>
                <p className='text-600'>  The documentation is available online at https://lottiefiles.github.io/lottie-docs/</p>
                <div className='content_box text-end'>
                    <Link variant="dark" className='signin text-blue  ' to={"/repositories"} > Go To Github Issue</Link>
                </div>
            </div>

        </div>
    </>

)

export default SpnReqDescriptionView;