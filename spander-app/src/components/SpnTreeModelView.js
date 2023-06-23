import SpnCLIView from "./SpnCLIView";
import SpnTreeView from "./SpnTreeView";
import React from 'react';
import { Row, Container, } from 'react-bootstrap';

const SpnTreeModelView = (props) => (
   <>
      <SpnTreeView {...props}/>
      {/*<SpnCLIView />*/}
   </>
)

export default SpnTreeModelView;