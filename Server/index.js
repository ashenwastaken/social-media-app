import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';    
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import { register } from './Controllers/auth.js';
import { createPost } from './Controllers/post.js';
import { verifyToken } from './Middlewares/auth.js';
import User from './Models/User.js';
import Post from './Models/Post.js';
import { users, posts } from './Data/index.js';

//config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));
express.json({limit: '30mb', extended: true});
express.urlencoded({limit: '30mb', extended: true});
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "pulbic/assets")));

//file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pulbic/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

//routes
app.post("/auth/register", upload.single('picture'), register); //register needs the upload variable
app.post("/posts", verifyToken, upload.single('picture'), createPost); //createPost needs the upload variable

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('posts', postRoutes);

//mongoose connection
const port = process.env.PORT || 5000;
mongoose.connect(process.env.Mongo_URL).
then(() => {app.listen(port, () => console.log(`Server running on port: ${port}`));
// User.insertMany(users);
// Post.insertMany(posts);
})
.catch((error) => console.log(error.message));
