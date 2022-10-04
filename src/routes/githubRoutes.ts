/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { GithubIssue, GithubServices } from '../services/githubServices';

const router = Router();
const githubServices = new GithubServices();

type Comment = {
    body: string;
}

const doesIssueHaveImage = (issueBody: string): boolean => {
    let hasImage = false;
    if (issueBody?.includes('<img')) {
        hasImage = true
    }
    return hasImage;
};

// GET issue
router.get("/api/v1/github/:owner/:repo/issue/:issue_number", async (req: Request, res: Response) => {
    try {
        const issue: GithubIssue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
        if (issue) {
            res.status(200).json(issue);
            return;
        }
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
    res.status(200).json({error: 'an error occurred'});
});

// GET image
router.get("/api/v1/github/:owner/:repo/issue/:issue_number/image", async(req, res) => {
    try {
        const issue: GithubIssue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
        if (issue != null) {
            const hasImage = doesIssueHaveImage(issue.body);
            res.status(200).json({ 'containsImage': hasImage });
            return;
        }
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
    res.status(200).json({error: 'an error occurred'});
});

// POST comment
router.post("/api/v1/github/:owner/:repo/issue/:issue_number/comment", async (req, res) => {
    const comment: Comment = req.body as Comment;
    try {
        const result = await githubServices.postComment(req.params.owner, req.params.repo, req.params.issue_number, comment.body);
        res.status(200).json(result);
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
    }
});

// POST identify
router.post("/api/v1/github/:owner/:repo/issue/:issue_number/identify", async (req, res) => {
    const comment: Comment = req.body as Comment;
    try {
        const issue: GithubIssue = await githubServices.getIssue(req.params.owner, req.params.repo, req.params.issue_number);
        if (issue != null) {
            if (doesIssueHaveImage(issue.body)) {
                const date = new Date();
                const datedComment = `${comment.body} ${date.toString()}`;
                const result = await githubServices.postComment(req.params.owner, req.params.repo, req.params.issue_number, datedComment);
                res.status(200).json(result);
            } else {
                res.status(200).json({ 'containsImage': false });
            }
            return;
        }
    } catch(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({error: 'an internal error occurred'});
        return;
    }
    res.status(200).json({error: 'an error occurred'});
});

export default router;
