import express from 'express';
import {getServerPublicKey} from "../controllers/encryptDecrypt.js";

const router = express.Router();

router.get('/get-server-public-key', getServerPublicKey);

export default router;