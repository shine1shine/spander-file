import SpnRepositoryMembers from "../components/SpnRepositoryMembers";
import SpnReqDescriptionView from "../components/SpnReqDescriptionView";
import SpnTopBar from "../components/SpnTopBar";
import SpnTreeModelView from "../components/SpnTreeModelView";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRepositoryCollaborators } from "../api/getRepositoryCollaborators";
import { getToken } from "../utils/accessToken";
import { getRepository } from "../api/getRepository";
import { useSelector } from "react-redux";
const SpnRepositoryScreen = (props) => {
  const state = useSelector(
    (state) => state.loginUserDetailsSlice.loginUserDetails
  );
  const params = useParams();
  const { id } = params;
  const [currRepository, setCurrRepository] = useState({});
  const [collaborators, setCollaborators] = useState(null);
  const navigate = useNavigate()
  useEffect(()=>{
    const token = getToken()
    if(!token){
      navigate('/login', { replace : true})
    }
  },[])
  useEffect(() => {
    const loadRepositories = async () => {
      const res = await getRepository(id)
      let currRepo = res;
      setCurrRepository(currRepo);
    };
    loadRepositories();
  }, []);

  useEffect(() => {
    const loadCollaborators = async () => {
      if (currRepository) {
        let collaborators = await getRepositoryCollaborators({
          owner: currRepository?.owner?.login,
          repo: currRepository?.name,
        });
        setCollaborators(collaborators?.data);
      }
    };
    loadCollaborators();
  }, [currRepository]);

  
  console.log(id, currRepository, collaborators, "[COLLABORATORS]");

  console.log(`Repository Name: ${currRepository?.name}`);
  console.log(`Description: ${currRepository?.description}`);

  return (
    <>
      <SpnTopBar />
      {/* The SpnTreeModelView takes all the screen and is centered, the tree view width shuld be 100% but the CLI should be about 50% or leff */}
      <SpnTreeModelView currRepository={currRepository}/>
      {/* Members view should be at the left side to the CLI and the bottom */}
      <SpnRepositoryMembers collaborators={collaborators} />
      {/* Req description   view should be at the right side to the CLI and the bottom */}
      <SpnReqDescriptionView currRepository={currRepository} />
    </>
  );
};


export default SpnRepositoryScreen;