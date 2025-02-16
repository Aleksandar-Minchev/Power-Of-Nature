import jwt from "jsonwebtoken";
import { AUTH_COOKIE, JWT_SECRET } from "../config.js";


export const authMiddleware =  (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE];

    if (!token){
        return next();
    }

    try{
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;
        res.locals.user = decodedToken;        
    } catch (err) {
        res.clearCookie(AUTH_COOKIE);
        return res.redirect('/auth/login');
    }

    next();
};

export const isAuth = (req, res, next) => {
    if (!req.user){
        return res.redirect('/auth/login');
    }

    next();
}

export const isGuest = (req, res, next) => {
    if (req.user){
        return res.redirect('/');
    }

    next();
}