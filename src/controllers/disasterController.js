import { Router } from "express";
import { disasterTypesView } from "../utils/disasterUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import disasterService from "../services/disasterService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const disasterController = Router();

disasterController.get('/', (req, res) => {
    res.render('disasters/catalog');
});

disasterController.get('/create', isAuth, (req, res) => {
    const disasterTypes = disasterTypesView()

    res.render('disasters/create', {disasterTypes});
});

disasterController.post('/create', isAuth, async (req, res) => {
    const disasterData = req.body;
    const ownerId = req.user.id;
    const disasterTypes = disasterTypesView(disasterData.type)

    try {
        await disasterService.create(disasterData, ownerId);
        
        res.redirect('/disasters');
    } catch (err) {
        res.render('disasters/create', {
            error: getErrorMessage(err),
            disasters: disasterData,
            disasterTypes
        })
    }
});


export default disasterController;