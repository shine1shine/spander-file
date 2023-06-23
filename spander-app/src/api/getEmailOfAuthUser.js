import { Octokit } from "@octokit/core"
import { getToken } from "../utils/accessToken"

export const getEmailOfAuthUser = async() => {

    return new Promise(async(resolve, reject) => {
        const octokit = new Octokit({
        auth: getToken()
      })
        const userEmail = await octokit.request('GET /user/public_emails')

        if(!userEmail){
            reject(new Error("Error!"))
        }
        resolve(userEmail?.data)
    })
}