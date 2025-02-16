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
    };
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
    };
});

disasterController.get('/create', isAuth, (req, res) => {
    const disasterTypes = disasterTypesView();

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
        });
    };
});

disasterController.get('/:disasterId/details', async (req, res) => {
    const disasterId = req.params.disasterId;
    try {
        const disaster = await disasterService.getOne(disasterId);
        const isOwner = disaster.owner?.equals(req.user?.id);
        const isInterested = disaster.interestedList.includes(req.user?.id);

        res.render('disasters/details', {disaster, isOwner, isInterested});
    } catch (err) {
        res.redirect('404');
    }; 
});

disasterController.get('/:disasterId/interested', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    const userId = req.user.id;

    try {
        const disaster = await disasterService.interested(disasterId, userId);
        res.redirect(`/disasters/${disasterId}/details`);
    } catch (err) {
        res.redirect('404');
    };
});

disasterController.get('/:disasterId/edit', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    
    try {
        const disaster = await disasterService.getOne(disasterId);
        if (!disaster.owner?.equals(req.user?.id)){
            return res.redirect('404');
        };
        const disasterType = disasterTypesView(disaster.type);

        res.render('disasters/edit', {disaster, disasterType})
    } catch (err) {
        res.redirect('404');
    };    
});

disasterController.post('/:disasterId/edit', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    const disasterData = req.body;
    const disaster = await disasterService.getOne(disasterId);
    const disasterType = disasterTypesView(disaster.type) 
    
    if (!disaster.owner?.equals(req.user?.id)){
        return res.redirect('404');
    };
    
    try {
        await disasterService.update(disasterData, disasterId);
        res.redirect(`/disasters/${disasterId}/details`);

    } catch (err) {
        res.render('disasters/edit', {disaster: disasterData, error: getErrorMessage(err), disasterType});
    };    
});

disasterController.get('/:disasterId/delete', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;

    try{
        const disaster = await disasterService.getOne(disasterId);
        
        if (!disaster.owner?.equals(req.user?.id)){
            return res.redirect('404');
        };

        await disasterService.remove(disasterId);
        res.redirect('/disasters');

    } catch (err){
        return res.redirect('404');
    };
});


export default disasterController;