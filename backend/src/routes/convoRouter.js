import express from 'express';
import { GetConvo, StartConvo} from '../controllers/convoController.js';

const convoRouter = express.Router();

convoRouter.post('/startconvo', StartConvo);
convoRouter.get("/getconvo/:userId",GetConvo);


export { convoRouter };