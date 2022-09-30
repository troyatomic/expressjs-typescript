import * as express from "express";
import axios, { AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

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
    const options:AxiosRequestConfig = {
        method: 'GET',
        headers: getGithubHeaders(),
        url,
    };
    return axios(options);
};

const postComment = (url: string, comment: string): AxiosPromise => {
    const options:AxiosRequestConfig = {
        method: 'POST',
        headers: getGithubHeaders(),
        data: { 'body': comment},
        url,
    };
    return axios(options);
};

export const register = (app: express.Application) => {

    // home page
    app.get("/", (req, res) => {
        res.render("index");
    });

    // health
    app.get("/health", (req, res) => {
        res.status(200).json({'status': 'OK'});
    });

    // about page
    app.get("/about", (_req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${process.env.GITHUB_REPO}/issues`
        const options:AxiosRequestConfig = {
            method: 'GET',
            headers: getGithubHeaders(),
            url,
        };
        void axios(options).then((response) => {
            // eslint-disable-next-line no-console
            console.log('response', response.data);
            res.status(200).render('about');
        });
    });

    // GET issue
    app.get("/api/v1/github/:owner/:repo/issue/:issue_number", (req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
        void getIssue(url).then((response) => {
            const issue: Issue = response.data as Issue;
            res.status(200).json({'id': issue.id, 'title': issue.title, 'body': issue.body});
        });
    });

    // GET image
    app.get("/api/v1/github/:owner/:repo/issue/:issue_number/image", (req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
        const options:AxiosRequestConfig = {
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
            res.status(200).json({'containsImage': hasImage});
        });
    });

    // POST comment
    app.post("/api/v1/github/:owner/:repo/issue/:issue_number/comment", (req, res) => {
        const body: Comment = req.body as Comment;
        const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}/comments`;
        void postComment(url, body.body).then((response) => {
            let messageResponse = "failed";
            if (response.status < 400) {
                messageResponse = "success";
            }
            res.status(response.status).json({'message': messageResponse});
        });
    });

    // POST identify
    app.post("/api/v1/github/:owner/:repo/issue/:issue_number/identify", (req, res) => {
        let url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
        void getIssue(url).then((response) => {
            const issue: Issue = response.data as Issue;
            const body: Comment = req.body as Comment;
            if (doesIssueHaveImage(issue.body)) {
                url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}/comments`;
                const date = new Date();
                const comment  = `${body.body} ${date.toString()}`;
                void postComment(url, comment).then((commentResponse) => {
                    let messageResponse = "failed";
                    if (commentResponse.status < 400) {
                        messageResponse = "success";
                    }
                    res.status(response.status).json({'message': messageResponse});
                });
            } else {
                res.status(200).json({'message': 'failed'});
            }
        });
    });
};
