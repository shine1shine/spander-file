import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ZoomButton = ({ tooltip, onClick, imgSrc }) => (
  <OverlayTrigger placement="right" overlay={<Tooltip>{tooltip}</Tooltip>}>
    <button onClick={onClick}>
      <img src={imgSrc} />
    </button>
  </OverlayTrigger>
);

export default ZoomButton;
