/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { GithubServices } from '../services/githubServices';

const router = Router();

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
    if (req.params.owner && req.params.repo && req.params.issue_number) {
        const githubServices = new GithubServices();
        try {
            const issue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
            if (issue != null) {
                res.status(200).json(issue);
            }
        } catch(error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(500).json({});
        }
        res.status(401).json({error: 'an error occurred'});
    }
});

// GET image
router.get("/api/v1/github/:owner/:repo/issue/:issue_number/image", (req, res) => {
    const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
    const options: AxiosRequestConfig = {
        method: 'GET',
        headers: getGithubHeaders(),
        url,
    };
    void axios(options).then((response) => {
        const issue: Issue = response.data as Issue;
        let hasImage = false;
        if (issue.body?.includes('<img')) {
            hasImage = true
        }
        res.status(200).json({ 'containsImage': hasImage });
    });
});

// POST comment
router.post("/api/v1/github/:owner/:repo/issue/:issue_number/comment", (req, res) => {
    const body: Comment = req.body as Comment;
    const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}/comments`;
    void postComment(url, body.body).then((response) => {
        let messageResponse = "failed";
        if (response.status < 400) {
            messageResponse = "success";
        }
        res.status(response.status).json({ 'message': messageResponse });
    });
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
