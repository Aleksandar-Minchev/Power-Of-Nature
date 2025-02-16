import { Router } from "express";
import authService from "../services/authService.js";
import { AUTH_COOKIE } from "../config.js";
import { getErrorMessage } from "../utils/errorUtils.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const authController = Router();

authController.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

authController.post('/login', isGuest, async (req, res) => {
    const {email, password} = req.body;

    try{
        const token = await authService.login(email, password);
        res.cookie(AUTH_COOKIE, token, {httpOnly: true});
        res.redirect('/');
    } catch(err){
        return res.render('auth/login', { 
            error: getErrorMessage(err), 
            user: { email }
        });        
    }
});

authController.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

authController.post('/register', isGuest, async (req, res) => {
    const userData = req.body;
    try{
        const token = await authService.register(userData);
        res.cookie(AUTH_COOKIE, token);
        res.redirect('/');
    } catch (err){
        return res.render('auth/register', {
            error: getErrorMessage(err), 
            user: userData            
        }); 
    }   
});

authController.get('/logout', isAuth, (req, res) => {
    res.clearCookie(AUTH_COOKIE);

    res.redirect('/');
});

export default authController;