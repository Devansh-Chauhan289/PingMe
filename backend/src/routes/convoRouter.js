import express from 'express';
import { GetConvo, getMsg, GetUsers, SendMsg, StartConvo} from '../controllers/convoController.js';

const convoRouter = express.Router();


convoRouter.post('/startconvo', StartConvo);
convoRouter.get("/getconvo/:userId",GetConvo);
convoRouter.post("/message",SendMsg)
convoRouter.get("/getmsg/:convoId",getMsg)
convoRouter.get("/getusers/:userId",GetUsers)
convoRouter.get("/",(req,res) => {
    res.status(200).send("Server is live")
})


export { convoRouter };