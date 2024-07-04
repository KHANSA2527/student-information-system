import Joi from 'joi';


const signUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),

})
export {signUpSchema}