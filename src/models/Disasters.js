import { Schema, model, Types } from "mongoose";

const disasterSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, 'Title should be at least 2 characters long!'],              
    },
    type: {
        type: String,
        required: [true, 'Disaster Type is required!']
    },
    location: {
        type: String,
        required: [true, 'Location are required!'],
        minLength: [3, 'Location should be at least 3 characters long!']
    },
    image: {
        type: String,
        required: [true, 'ImageURL is required!'],
        match: [/^https?:\/\//, 'ImageUrl should start with http://... or https://...!'] 
    },
    year: {
        type: Number,
        required: [true, 'Year of the event is required!'],
        min: [0, 'Year of the event should be between 0 and 2024!'],
        max: [2024, 'Year of the event should be between 0 and 2024!'],
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minLength: [10, 'Description should be at least 10 characters long!']
    },
    interestedList : [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    },
});

const Disaster = model('Disaster', disasterSchema);

export default Disaster;