import express from 'express';
import {getPublicKey} from "../utilities/cryptographicFunctions.js";

const router = express.Router();

export const getServerPublicKey = async (req, res) => {
    try {
        let publicKey = getPublicKey();

        res.status(200).json({server_public_key: publicKey});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export default router;
