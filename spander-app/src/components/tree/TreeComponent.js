// TreeComponent.js
import React from 'react';
import { Tree } from 'react-organizational-chart';

const TreeLabel = ({ treeNode, isDragging, setActiveClass, setGithubIssue, onAddNode, isChanged, touchEvents }) => {
  const handleDescriptionClick = () => {
    if (!isDragging) {
      setActiveClass(true);
      setGithubIssue(true);
    }
  };

  const handleAddNodeClick = () => {
    setActiveClass(false);
    onAddNode(treeNode.uniqueIndex);
  };

  return (
    <div className="tree_levels root" {...touchEvents(treeNode)}>
      <div className="tree_description_text" onClick={handleDescriptionClick}>
        {treeNode.name}
      </div>
      <button onClick={handleAddNodeClick} disabled={isChanged}>
        +
      </button>
    </div>
  );
};

const TreeComponent = ({ treeNode, renderTree, ...props }) => (
  <Tree
    lineWidth={'2px'}
    lineColor={'#ADB5BD'}
    nodePadding={'10px'}
    lineBorderRadius={'5px'}
    label={<TreeLabel treeNode={treeNode} {...props} />}
  >
    {treeNode.childNodes.map((node, index) => (
      <React.Fragment key={node.uniqueIndex}>{renderTree(node, 1, false)}</React.Fragment>
    ))}
  </Tree>
);

export default TreeComponent;
