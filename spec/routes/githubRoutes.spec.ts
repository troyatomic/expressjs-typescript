
import { GithubIssue } from '../../src/services/githubServices';
import axios, { AxiosRequestConfig } from 'axios';


describe('GithubRoutes -', () => {
    it('1. health check', async () => {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: 'http://localhost:8080/health'
        };
        const response = await axios(options);
        expect(response.status).toEqual(200);
    });

    it('2. issue - exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}`
        };
        const response = await axios(options);
        const issue: GithubIssue = response.data;
        expect(response.status).toEqual(200);
        expect(issue.title).toEqual('issue with image');
    });

    it('3. issue - NOT exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}`
        };

        const response = await axios(options);
        expect(response.data.error).toEqual('an error occurred');
    });

    it('4. image - has image', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/image`
        };

        const response = await axios(options);
        expect(response.data.containsImage).toEqual(true);
    });

    it('5. image - no image', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '1';

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/image`
        };

        const response = await axios(options);
        expect(response.data.containsImage).toEqual(false);
    });

    it('6. image - NOT exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/image`
        };

        const response = await axios(options);
        expect(response.data.error).toEqual('an error occurred');
    });

    it('7. comment - exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/comment`,
            data: { body: 'this is a comment'}
        };

        const response = await axios(options);
        expect(response.data.message).toEqual('success');
    });

    it('8. comment - NOT exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/comment`,
            data: { body: 'this is a comment'}
        };

        const response = await axios(options);
        expect(response.data.message).toEqual('failed');
    });

    it('9. identify - has image', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/identify`,
            data: { body: 'this is a comment'}
        };

        const response = await axios(options);
        expect(response.data.message).toEqual('success');
    });

    it('10. identify - no image', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '1';

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/identify`,
            data: { body: 'this is a comment'}
        };

        const response = await axios(options);
        expect(response.data.containsImage).toEqual(false);
    });

    it('11. identify - NOT exists', async () => {
        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `http://localhost:8080/api/v1/github/${owner}/${repo}/issue/${issue_number}/identify`,
            data: { body: 'this is a comment'}
        };

        const response = await axios(options);
        expect(response.data.error).toEqual('an error occurred');
    });
});