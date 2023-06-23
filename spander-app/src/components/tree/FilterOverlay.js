import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import filter from '../../assets/images/filter.svg';

function FilterOverlay({ handelFilter }) {
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>Filters</Tooltip>}>
      <button onClick={handelFilter}>
        <img src={filter} alt="Filter" />
      </button>
    </OverlayTrigger>
  );
}

export default FilterOverlay;
