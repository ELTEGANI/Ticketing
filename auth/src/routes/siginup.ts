import express,{Request,Response} from 'express';
import {body} from 'express-validator';
import {User} from '../models/user';
import {BadRequestError} from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import {validationRequest} from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signup',[
   body('email')
     .isEmail()
     .withMessage('Email Must Be Valid'),
   body('password')
      .trim()  
      .isLength({ min:4,max:20})
      .withMessage('password must be between 4 and 20 chcarcter')
],validationRequest,
async(req:Request,res:Response) => {
   const {email,password} = req.body;
   const existingUser = await User.findOne({email})
   
   if(existingUser){
     throw new BadRequestError('Email In Use')
   }

   const user = User.build({email,password});
   await user.save();

   //Generate JWT
   const userJwt = jwt.sign(
      {
      id:user.id,
      email:user.email
      },
     process.env.JWT_KEY!
     );

   //Store it on session object
    req.session = {
       jwt:userJwt
    };

   res.status(201).send(user);
});

export { router as signUpRouter};