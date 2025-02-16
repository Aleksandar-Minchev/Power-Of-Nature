import Disaster from "../models/Disasters.js";

export default {
    create (disasterData, ownerId){
        const result = Disaster.create({
            ...disasterData,
            owner: ownerId
        });

        return result;
    },
    
}