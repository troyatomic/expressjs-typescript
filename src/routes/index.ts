import { Router } from 'express';
import githubRouter from './githubRoutes';

const router = Router();

router.get("/", (req, res) => {
    res.render("index");
});

// health
router.get("/health", (req, res) => {
    res.status(200).json({ 'status': 'OK' });
});

router.use(githubRouter);

export default router;