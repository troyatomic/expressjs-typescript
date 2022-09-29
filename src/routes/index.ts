import * as express from "express";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

type Issue = {
    title: string,
    id: number,
    body: string | null
}


export const register = (app: express.Application) => {
    const githubHeaders: AxiosRequestHeaders = {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${process.env.GITHUB_TOKEN}`
    }

    // home page
    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/health", (req, res) => {
        res.status(200).json({'status': 'OK'});
    });

    // about page
    app.get("/about", (req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${process.env.GITHUB_REPO}/issues`
        const options:AxiosRequestConfig = {
            method: 'GET',
            headers: githubHeaders,
            url,
        }
        void axios(options).then((response) => {
            // eslint-disable-next-line no-console
            console.log('response', response.data);
            res.status(200).render('about');
        });
    });

    app.get("/api/v1/github/:owner/:repo/issue/:issue_number", (req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
        const options:AxiosRequestConfig = {
            method: 'GET',
            headers: githubHeaders,
            url,
        }
        void axios(options).then((response) => {
            const issue: Issue = response.data as Issue;
            // eslint-disable-next-line no-console
            console.log('response', issue.title);
            res.status(200).json({'id': issue.id, 'title': issue.title, 'body': issue.body});
        });
    });


    app.get("/api/v1/github/:owner/:repo/issue/:issue_number/image", (req, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${req.params.owner}/${req.params.repo}/issues/${req.params.issue_number}`;
        const options:AxiosRequestConfig = {
            method: 'GET',
            headers: githubHeaders,
            url,
        }
        void axios(options).then((response) => {
            const issue: Issue = response.data as Issue;
            let hasImage = false;
            if (issue.body?.includes('<img')) {
                hasImage = true
            }
            res.status(200).json({'containsImage': hasImage});
        });
    });
};
