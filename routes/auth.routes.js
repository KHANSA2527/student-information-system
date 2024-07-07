import {Router} from 'express'
import { forgetPassword, login, resendOtp,  passwordReset, userSignUp, verifyOtp, } from '../controllers/auth.controller.js'
const router = Router();

router.post('/sign-up', userSignUp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login)
router.post('/forget-password', forgetPassword)
router.post('/reset-Password', passwordReset)

export {router}