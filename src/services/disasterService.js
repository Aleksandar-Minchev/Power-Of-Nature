import Disaster from "../models/Disasters.js";

export default {
    create (disasterData, ownerId){
        const result = Disaster.create({
            ...disasterData,
            owner: ownerId
        });

        return result;
    },
    async getAll(filter = {}){
        let disasters = await Disaster.find({});

        if (filter.name){
            disasters = disasters.filter(disaster => 
                disaster.name.toLowerCase().includes(filter.name.toLowerCase())
            )
        };

        if (filter.type){
            disasters = disasters.filter(disaster =>
                disaster.type == filter.type
            )
        };        
    
        return disasters;
    }

}