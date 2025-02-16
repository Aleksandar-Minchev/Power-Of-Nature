import { Router } from "express";
import { disasterTypesView } from "../utils/disasterUtils.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import disasterService from "../services/disasterService.js";
import { getErrorMessage } from "../utils/errorUtils.js";

const disasterController = Router();

disasterController.get('/', async (req, res) => {
    try {
        const disasters = await disasterService.getAll();
        res.render('disasters/catalog', { disasters });   
    } catch (err) {
        res.render('/', {
            error: getErrorMessage(err)
        }); 
    }
});

disasterController.get('/search', async (req, res) => {
    const filter = req.query;

    try {
        const disasters = await disasterService.getAll(filter);
        res.render('disasters/search', {disasters, filter, disasterTypes: disasterTypesView(filter.type)});   
        
    } catch (err) {
        res.render('disasters/search', {
            error: getErrorMessage(err)
        });
    }
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

disasterController.get('/:disasterId/details', async (req, res) => {
    const disasterId = req.params.disasterId;
    try {
        const disaster = await disasterService.getOne(disasterId);
        const isOwner = disaster.owner?.equals(req.user?.id);
        const IsInterested = disaster.interestedList.includes(req.user?.id);

        res.render('disasters/details', {disaster, isOwner, IsInterested});
    } catch (err) {
        res.redirect('404');
    }; 
});


export default disasterController;