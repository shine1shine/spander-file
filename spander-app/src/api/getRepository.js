import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";
import logoutHandler from "../utils/logoutHandler";



export const getRepository = async (id) => {
  return new Promise(async (resolve, reject) => {
    if (!id) {
      resolve({ notFound: true })
    }
    const octokit = new Octokit({
      auth: getToken(),
    });
    try {
      const Repo = await octokit.request('GET /repositories/:id', {id}, {
       
      })
    
      if (!Repo) {
        reject(new Error("Error!"));
        return
      }
      if (Repo.data) {
        resolve(Repo.data)
        return
      }
      
    } catch (err) {
     
      if (err.status == 404) {
        window.location.href = "/404";
      }
      if (err.status == 401) {
        logoutHandler()
      }
    }
  });
};

