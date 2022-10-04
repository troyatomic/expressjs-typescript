
import { GithubCommentResponse, GithubIssue, GithubServices } from '../../src/services/githubServices';

describe('GithubServices -', () => {
    it('1. issue should exist', async () => {
        const githubServices = new GithubServices();

        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';

        const issue: GithubIssue = await githubServices.getIssue(owner, repo, issue_number);

        expect(issue.title).toEqual("issue with image");
    });

    it('2. issue should NOT exist', async () => {
        const githubServices = new GithubServices();

        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';

        const issue: GithubIssue = await githubServices.getIssue(owner, repo, issue_number);

        expect(issue).toEqual(undefined);
    });

    it('3. post to existing issue', async () => {
        const githubServices = new GithubServices();

        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '2';
        const comment = 'this is a test comment';

        const response: GithubCommentResponse = await githubServices.postComment(owner, repo, issue_number, comment);

        expect(response).not.toBe(undefined);
        expect(response.message).toEqual('success');
    });

    it('4. post to NON-existing issue', async () => {
        const githubServices = new GithubServices();

        const owner = 'troyatomic';
        const repo = 'expressjs-typescript';
        const issue_number = '5';
        const comment = 'this is a test comment';

        const response: GithubCommentResponse = await githubServices.postComment(owner, repo, issue_number, comment);

        expect(response).not.toBe(undefined);
        expect(response.message).toEqual('failed');
    });
});