/* eslint-disable @typescript-eslint/no-empty-function */
import axios, { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';

export type GithubIssue = {
    title: string,
    id: number,
    body: string | null
}

export type GithubCommentResponse = {
    message: 'success' | 'failed'
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

const postGithubComment = (url: string, comment: string): AxiosPromise => {
    const options: AxiosRequestConfig = {
        method: 'POST',
        headers: getGithubHeaders(),
        data: { 'body': comment },
        url,
    };
    return axios(options);
};

export class GithubServices {

    public async getIssue(owner: string, repo: string, issueNumber: string): Promise<GithubIssue> {
        const url = `${process.env.GITHUB_URL}/repos/${owner}/${repo}/issues/${issueNumber}`;
        try {
            const response: AxiosResponse = await getGithubIssue(url);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const issue: GithubIssue = response.data;
            return { 'id': issue.id, 'title': issue.title, 'body': issue.body };
        } catch(error) {
            return;
        }
    }

    public async postComment(owner: string, repo: string, issueNumber: string, comment: string): Promise<GithubCommentResponse> {
        const url = `${process.env.GITHUB_URL}/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
        try {
            const response: AxiosResponse = await postGithubComment(url, comment);
            return response.status < 400 ? { message: 'success' } : { message: 'success' };
        } catch(error) {
            return { message: 'failed'};
        }
    }

}