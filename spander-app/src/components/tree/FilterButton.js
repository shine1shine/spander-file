import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const FilterButton = ({ tooltip, onClick, children, isActive }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
    <button className={`button ${isActive ? 'selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  </OverlayTrigger>
);

export default FilterButton;
