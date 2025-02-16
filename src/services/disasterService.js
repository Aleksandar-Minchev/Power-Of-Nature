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
    },

    getOne (disasterId) {
        const disaster = Disaster.findById(disasterId);
        return disaster;
    },

    async interested(disasterId, userId){
        const disaster = await Disaster.findById(disasterId);

        if (disaster.owner?.equals(userId)){
            throw new Error ("You can't vote for your own volcanoes")
        }
         if (disaster.interestedList.includes(userId)){
            throw new Error ("You've already voted for this volcano")
        }

        disaster.interestedList.push(userId);

        return disaster.save();
    },

    async update (disasterData, disasterId){
        return Disaster.findByIdAndUpdate(disasterId, disasterData, {runValidators: true});
    },

    async remove(disasterId){
        return Disaster.findByIdAndDelete(disasterId);
    }
}