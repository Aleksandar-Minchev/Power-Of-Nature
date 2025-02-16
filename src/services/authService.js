import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/generateToken.js";


export default {
    async login (email, password){
        const user = await User.findOne({email});
        if (!user){
            throw new Error('Invalid email or password!')
        }

        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass){
            throw new Error('Invalid email or password!');
        }

        const token = generateToken(user);

        return token;        
    },

    async register(userData){

        if (userData.password !== userData.rePassword){
            throw new Error ('Passwords mismatch');
        };

        const userId = await User.findOne({ email: userData.email}).select({_id: 1});
        if (userId){
            throw new Error("This username already exists");            
        }

        const newUser =  await User.create(userData);
        const token = generateToken(newUser);

        return token;
    }    
}