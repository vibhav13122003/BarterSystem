import express from 'express';
import { registerUser, login,updateWishList, updateReportedUser ,isReported, getAllUsers,sendMessage,getEnabledUsers,getChats,setEnableUsers} from '../controllers/userController.js';


import mongoose from 'mongoose';
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', (req, res, next) => {
    console.log('POST /user/register hit');
    next();
}, registerUser);
router.post('/login', login);
router.post('/update-wishlist',isAuthenticated,updateWishList)
router.post('/report-action', isAuthenticated, updateReportedUser);
router.get('/getall',getAllUsers)
router.post('/is-reported', isAuthenticated,isReported);
router.post('/sendMessage/:id', isAuthenticated, sendMessage);
router.get('/getChats', getChats);
router.post('/setEnabledUsers/:id', setEnableUsers);
router.get('/getEnabledUsers/:id',getEnabledUsers)


export default router;
