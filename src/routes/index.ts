import * as express from "express";
import axios, { AxiosRequestConfig } from 'axios';

export const register = (app: express.Application) => {
    // home page
    app.get("/", (req: any, res) => {
        res.render("index");
    });

    app.get("/health", (req: any, res) => {
        res.status(200).json({'status': 'OK'});
    });

    // about page
    app.get("/about", (_req: any, res) => {
        const url = `${process.env.GITHUB_URL}/repos/${process.env.GITHUB_REPO}/issues`
        const options:AxiosRequestConfig = {
            method: 'GET',
            headers: {
                'accept': 'application/vnd.github+json',
                'authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            },
            url,
        }
        void axios(options).then((response) => {
            // eslint-disable-next-line no-console
            console.log('response', response.data);
            res.status(200).render('about');
        });
    });

};
