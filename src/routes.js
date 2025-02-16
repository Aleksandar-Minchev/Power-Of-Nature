import { Router } from 'express';
import homeController from './controllers/homeController.js';
import authController from './controllers/authController.js';

const routes = Router();

routes.use(homeController);
routes.use('/auth', authController);


routes.get('*', (req, res) => {
    res.render('404');
});

export default routes;