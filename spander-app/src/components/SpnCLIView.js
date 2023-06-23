import { Button } from 'react-bootstrap';
import React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const SpnCLIView = (props) => (
  <>
    <div className="spn_cli_view">
      <div className='d-flex align-items-center justify-content-between'>
        <h6 className='text-primary top_heading mb-0'>lottie-docs</h6>
        <Button variant="primary"> Save to Git</Button>
      </div>
      <div className='border p-3 mt-2'>

        <TreeView
          aria-label="file system navigator"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ width: "100%" }}
        >
          <TreeItem nodeId="0" label={<div className='tree_levels root'> <span> Project name</span>  </div>}>
            <TreeItem nodeId="1" label={<div className='tree_levels level1'> <span> level 1</span>  </div>}>
              <TreeItem nodeId="2" label={<div onClick={() => alert("click test")} className='tree_levels level2'> <span> Differences from the lottie community schema sdsadsad asdsa d</span> </div>} />
              <TreeItem nodeId="3" label={<div className='tree_levels level2'> <span> level 2</span> </div>} />
              <TreeItem nodeId="4" label={<div className='tree_levels level2'><span> level 2</span>  </div>}>
                <TreeItem nodeId="5" label={<div className='tree_levels level3'><span> level 3</span>  </div>} />
                <TreeItem nodeId="6" label={<div className='tree_levels level3'><span> level 3</span>  </div>}>
                  <TreeItem nodeId="7" label={<div className='tree_levels level4'><span> level 4</span>  </div>} />
                  <TreeItem nodeId="8" label={<div className='tree_levels level4'><span> level 4</span>  </div>}>
                    <TreeItem nodeId="9" label={<div className='tree_levels level5'><span> level 5</span>  </div>} />
                    <TreeItem nodeId="10" label={<div className='tree_levels level5'><span> level 5</span>  </div>} />
                  </TreeItem>
                </TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeItem>


        </TreeView>

      </div>
    </div>
  </>
)

export default SpnCLIView;