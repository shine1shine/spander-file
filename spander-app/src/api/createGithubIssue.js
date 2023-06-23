import { Octokit } from '@octokit/core';
import { getToken } from '../utils/accessToken';

export const createGithubIssue = async ({ currRepository, title, body }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    const response = octokit.request('POST /repos/{owner}/{repo}/issues', {
      owner: currRepository?.owner?.login,
      repo: currRepository?.name,
      title,
      body,
      labels: ['Spander'],
    });

    if (!response) {
      reject(new Error('Error!'));
    }

    resolve(response);
  });
};

export const updateGithubIssue = async ({ currRepository, issue_number, ...updatedBody }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    const response = octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: currRepository?.owner?.login,
      repo: currRepository?.name,
      issue_number,
      ...updatedBody,
    });

    if (!response) {
      reject(new Error('Error!'));
    }

    resolve(response);
  });
};

export const getGithubIssue = async ({ currRepository, issue_number }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    const response = octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
      owner: currRepository?.owner?.login,
      repo: currRepository?.name,
      issue_number,
      headers: {
        'If-None-Match': '',
      },
    });

    if (!response) {
      reject(new Error('Error!'));
    }

    resolve(response);
  });
};
