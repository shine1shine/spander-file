import { Octokit } from "@octokit/core"
import { getToken } from "../utils/accessToken"
import logoutHandler from "../utils/logoutHandler";

export const getUserDetails = async() => {

    return new Promise(async(resolve, reject) => {
        const octokit = new Octokit({
        auth: getToken()
      })
      try{
          const userData = await octokit.request('GET /user')
  
          if(!userData){
              reject(new Error("Error!"))
          }
          resolve(userData.data)
      }catch(err){
        if(err.status ==401){
            logoutHandler()
          }
      }
    })
}