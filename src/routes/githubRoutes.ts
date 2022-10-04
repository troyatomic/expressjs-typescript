/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { GithubIssue, GithubCommentResponse, GithubServices } from '../services/githubServices';

const router = Router();
const githubServices = new GithubServices();

type Issue = {
    title: string,
    id: number,
    body: string | null
}

type Comment = {
    body: string;
}

const getGithubHeaders = () => {
    const githubHeaders: AxiosRequestHeaders = {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    };
    return githubHeaders;
};

const doesIssueHaveImage = (issueBody: string): boolean => {
    let hasImage = false;
    if (issueBody?.includes('<img')) {
        hasImage = true
    }
    return hasImage;
};

const getIssue = (url: string): AxiosPromise => {
    const options: AxiosRequestConfig = {
        method: 'GET',
        headers: getGithubHeaders(),
        url,
    };
    return axios(options);
};

const postComment = (url: string, comment: string): AxiosPromise => {
    const options: AxiosRequestConfig = {
        method: 'POST',
        headers: getGithubHeaders(),
        data: { 'body': comment },
        url,
    };
    return axios(options);
};

// GET issue
router.get("/api/v1/github/:owner/:repo/issue/:issue_number", async (req: Request, res: Response) => {
    try {
        const issue: GithubIssue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
        if (issue != null) {
            res.status(200).json(issue);
            return;
        }
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
    res.status(401).json({error: 'an error occurred'});
});

// GET image
router.get("/api/v1/github/:owner/:repo/issue/:issue_number/image", async(req, res) => {
    try {
        const issue: GithubIssue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
        if (issue != null) {
            let hasImage = false;
            if (issue.body?.includes('<img')) {
                hasImage = true
            }
            res.status(200).json({ 'containsImage': hasImage });
            return;
        }
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
    res.status(401).json({error: 'an error occurred'});
});

// POST comment
router.post("/api/v1/github/:owner/:repo/issue/:issue_number/comment", async (req, res) => {
    const comment: Comment = req.body as Comment;
    try {
        const result = await githubServices.postComment(req.params.owner, req.params.repo, req.params.issue_number, comment.body);
        res.status(200).json(result);
        return;
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
});

// POST identify
router.post("/api/v1/github/:owner/:repo/issue/:issue_number/identify", (req, res) => {
    let url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
    void getIssue(url).then((response) => {
        const issue: Issue = response.data as Issue;
        const body: Comment = req.body as Comment;
        if (doesIssueHaveImage(issue.body)) {
            url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}/comments`;
            const date = new Date();
            const comment = `${body.body} ${date.toString()}`;
            void postComment(url, comment).then((commentResponse) => {
                let messageResponse = "failed";
                if (commentResponse.status < 400) {
                    messageResponse = "success";
                }
                res.status(response.status).json({ 'message': messageResponse });
            });
        } else {
            res.status(200).json({ 'message': 'failed' });
        }
    });
});
// };

export default router;
