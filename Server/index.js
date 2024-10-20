import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';    
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';

/*config*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "pulbic/assets")));

/*file storage*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pulbic/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

/*routes*/
app.post("/auth/register", upload.single('picture'), register);

/*mongoose connection*/
const port = process.env.PORT || 5000;
mongoose.connect(process.env.Mongo_URL).
then(() => app.listen(port, () => console.log(`Server running on port: ${port}`))).
catch((error) => console.log(error.message));
