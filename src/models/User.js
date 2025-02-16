import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [2, 'Username should be at least 2 characters long'],
        maxLength: [20, 'Username should be max 20 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        minLength: [10, 'Email should be at least 10 characters long']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password should be at least 10 characters long']
    }
});

userSchema.pre('save', async function (){
    this.password = await bcrypt.hash(this.password, 10);
});

const User = model('User', userSchema);

export default User;