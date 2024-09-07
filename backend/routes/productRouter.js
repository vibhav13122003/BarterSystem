import express from 'express';
import multer from 'multer';
import { registerProduct, postBid, searchItem, getAllFeedback, getAllProducts, getProductsById, updateProducts, deleteFeedback, deleteProducts, acceptBid, postFeedback, editFeedback } from '../controllers/productController.js';
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]), registerProduct);

// Ensure your route looks something like this
router.post('/bid/:id', postBid);


router.get('/searchItem', searchItem);
router.get('/getProductsById/:id', getProductsById);
router.get('/getAllProducts', getAllProducts);
router.put('/updateProducts/:id', isAuthenticated, updateProducts);
router.delete('/deleteProducts/:id', isAuthenticated, deleteProducts);
router.put('/acceptBid/:id',acceptBid);
router.post('/postFeedback/:id', isAuthenticated, postFeedback);
router.get('/getAllFeedback', isAuthenticated, getAllFeedback);
router.delete('/deleteFeedback/:id', isAuthenticated, deleteFeedback);
router.put('/editFeedback/:id', isAuthenticated, editFeedback);

export default router;
