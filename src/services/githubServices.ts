/* eslint-disable @typescript-eslint/no-empty-function */
import axios, { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

interface Issue {
    title: string,
    id: number,
    body: string | null
}

const getGithubHeaders = () => {
    const githubHeaders: AxiosRequestHeaders = {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    };
    return githubHeaders;
};

const getGithubIssue = (url: string): AxiosPromise => {
    const options: AxiosRequestConfig = {
        method: 'GET',
        headers: getGithubHeaders(),
        url,
    };
    return axios(options);
};

export class GithubServices {
    // eslint-disable-next-line no-empty-function
    constructor(){}

    public async getIssue(owner: string, repo: string, issueNumber: string): Promise<Issue> {
        const url = `${process.env.GITHUB_URL}/repos/${owner}/${repo}/issues/${issueNumber}`;
        try {
            const result: AxiosResponse = await getGithubIssue(url);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const issue: Issue = result.data;
            return { 'id': issue.id, 'title': issue.title, 'body': issue.body };
        } catch(error) {
            return;
        }
    }
}