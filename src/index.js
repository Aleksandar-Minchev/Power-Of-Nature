import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';

import routes from './routes.js';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

try{
    const uri = 'mongodb://localhost:27017/home-cooking-recipes';
    await mongoose.connect(uri);
    console.log('DB connected successfully'); 
} catch (err){
    console.error('Cannot connect to DB');
    console.log(err.message);    
}

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        setPageTitle (title) {this.pageTitle = title}
    }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.static('src/public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(authMiddleware);

app.use(routes);


app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));
