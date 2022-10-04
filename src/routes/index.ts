import { Router } from 'express';
import githubRouter from './githubRoutes';

const router = Router();

// home page
router.get("/", (req, res) => {
    res.render("index");
});

// about page
router.get("/about", (_req, res) => {
    res.status(200).render('about');
});

// health
router.get("/health", (req, res) => {
    res.status(200).json({ 'status': 'OK' });
});

router.use(githubRouter);

export default router;