import React from "react";

const SpnRepositoryMembers = ({ collaborators }) => {
  // deleted by Or Chuban
  return;
  return (
    <>
      <div className="inside_more_info">
        <h6 className="text-primary top_heading"> More info</h6>
        <ul>
          {Array.isArray(collaborators) &&
            collaborators.map((coll, index) => {
              return (
                <li key={index}>
                  <img src={coll.avatar_url} alt="USER" />
                  <span className="text-600"> {coll.login} </span>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default SpnRepositoryMembers;
