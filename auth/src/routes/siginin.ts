import express ,{Request,Response} from 'express';
import {body} from 'express-validator';
import {validationRequest,BadRequestError} from '@tjtickets/common';
import {User} from '../models/user';
import {Password} from '../utils/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',[
   body('email')
    .isEmail()
    .withMessage('Email Must Be Valid'),
   body('password')
     .trim() 
     .notEmpty()
     .withMessage('You Must Apply Password')
],validationRequest,async(req:Request,res:Response) => {
   const {email,password} = req.body;
   const existingUser = await User.findOne({email});
   if(!existingUser){
    throw new BadRequestError('Invalid Credentials');
   }
   const passwordMatch = await Password.compare(existingUser.password,password);

   if(!passwordMatch){
       throw new BadRequestError('Invalid Credentials');
   }
    //Generate JWT
    const userJwt = jwt.sign({
      id:existingUser.id,
      email:existingUser.email
   },process.env.JWT_KEY!);

   //Store it on session object
    req.session = {
       jwt:userJwt
    };

   res.status(200).send(existingUser);
});  


export { router as signInRouter};