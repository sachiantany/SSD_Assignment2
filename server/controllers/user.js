import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
import {decryptData, getPrivateKey} from "../utilities/cryptographicFunctions.js";

const secret = 'test';

export const signin = async (req, res) => {
  const {email, password} = JSON.parse(decryptData(getPrivateKey(), req.body.enc_data));

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User Does not Exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

export const signup = async (req, res) => {
  const {email, password, firstName, lastName} = JSON.parse(decryptData(getPrivateKey(), req.body.enc_data));

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong" });
    
    console.log(error);
  }
};
