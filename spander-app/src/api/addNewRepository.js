import { Octokit } from '@octokit/core';
import { getToken } from '../utils/accessToken';

export const addNewRepository = async ({ name, description, isPrivate, owner, currentUser }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });
    debugger;
    const response =
      owner === currentUser?.login
        ? await octokit.request('POST /user/repos', {
            name: name,
            description: description,
            private: isPrivate,
            auto_init: false,
          })
        : await octokit
            .request('POST /orgs/{org}/repos', {
              name: name,
              description: description,
              org: owner,
              private: isPrivate,
              auto_init: false,
            })
            .catch((err) => (err.status === 422 ? { nameExists: true } : err.message));
    if (!response) {
      reject(new Error('Error!'));
    }
    resolve(response);
  });
};
