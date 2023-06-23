import { Octokit } from "@octokit/core"
import { getToken } from "../utils/accessToken"
import { FILE_PATH, postContentToRepository } from "./postContentsToRepository"
import { Base64 } from "js-base64"
import { objToJson } from "../utils/json-utils"

export const getContentOfRepository = ({ currRepository }) => {
    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: getToken()
        })
        try {
            let response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                path: FILE_PATH
            })
            resolve(response)
        } catch (err) {
            const base64Content = Base64.encode(objToJson({ "name": currRepository?.name, "uniqueIndex": 0, "childNodes": [], "parentNode": null, "issueDetails": {}, "isGithubIssue": false, "nonGithubIssueDetail": { "markAsDone": false } }))
            const response = await postContentToRepository({
                currRepository,
                user: currRepository?.owner?.login,
                base64Content: base64Content,
            });
            resolve(await getContentOfRepository({ currRepository }))
        }
    })
}