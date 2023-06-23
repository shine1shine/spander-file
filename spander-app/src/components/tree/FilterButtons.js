import React from 'react';
import FilterButton from './FilterButton';

function FilterButtons({ handleButtonClick, activeButton }) {
  return (
    <>
      <FilterButton tooltip="done nodes" onClick={() => handleButtonClick(1)} isActive={activeButton === 1}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.30811 8.87746L7.77011 10.3395L10.9614 7.14746" stroke="#6C757D" />
          <path
            d="M13.1667 14.5H3.83333C3.09667 14.5 2.5 13.9033 2.5 13.1667V3.83333C2.5 3.09667 3.09667 2.5 3.83333 2.5H13.1667C13.9033 2.5 14.5 3.09667 14.5 3.83333V13.1667C14.5 13.9033 13.9033 14.5 13.1667 14.5Z"
            stroke="#6C757D"
          />
        </svg>
      </FilterButton>
      <FilterButton tooltip="not done nodes" onClick={() => handleButtonClick(2)} isActive={activeButton === 2}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.1667 14.5H3.83333C3.09667 14.5 2.5 13.9033 2.5 13.1667V3.83333C2.5 3.09667 3.09667 2.5 3.83333 2.5H13.1667C13.9033 2.5 14.5 3.09667 14.5 3.83333V13.1667C14.5 13.9033 13.9033 14.5 13.1667 14.5Z"
            stroke="#6C757D"
          />
        </svg>
      </FilterButton>
      <FilterButton tooltip="open issues" onClick={() => handleButtonClick(3)} isActive={activeButton === 3}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.3855 6.61455C11.4269 7.65595 11.4269 9.34439 10.3855 10.3858C9.34414 11.4272 7.6557 11.4272 6.6143 10.3858C5.5729 9.34438 5.5729 7.65594 6.6143 6.61455C7.6557 5.57315 9.34414 5.57315 10.3855 6.61455Z"
            fill="#6C757D"
          />
          <path
            d="M10.3855 6.61455C11.4269 7.65595 11.4269 9.34439 10.3855 10.3858C9.34414 11.4272 7.6557 11.4272 6.6143 10.3858C5.5729 9.34438 5.5729 7.65594 6.6143 6.61455C7.6557 5.57315 9.34414 5.57315 10.3855 6.61455"
            stroke="#6C757D"
          />
          <path
            d="M12.7426 4.25736C15.0858 6.60051 15.0858 10.3995 12.7426 12.7426C10.3995 15.0858 6.60049 15.0858 4.25736 12.7426C1.91421 10.3995 1.91421 6.60049 4.25736 4.25736C6.60051 1.91421 10.3995 1.91421 12.7426 4.25736"
            stroke="#6C757D"
          />
        </svg>
      </FilterButton>
      <FilterButton tooltip="closed issues" onClick={() => handleButtonClick(4)} isActive={activeButton === 4}>
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.5 14.5C5.18629 14.5 2.5 11.8137 2.5 8.5C2.5 5.18629 5.18629 2.5 8.5 2.5C11.8137 2.5 14.5 5.18629 14.5 8.5C14.5 11.8137 11.8137 14.5 8.5 14.5Z"
            fill="#6610F2"
            stroke="#F8F9FA"
          />
          <path d="M8 10L6.5 8.5" stroke="#F8F9FA" />
          <path d="M10.5 7.5L8 10" stroke="#F8F9FA" />
        </svg>
      </FilterButton>
    </>
  );
}

export default FilterButtons;
