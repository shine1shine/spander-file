import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = ({ height, width, color, ariaLabel, radius }) => (
  <div className="panzoom-loader">
    <TailSpin
      height={height}
      width={width}
      color={color}
      ariaLabel={ariaLabel}
      radius={radius}
      wrapperStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    />
  </div>
);

export default LoadingSpinner;
