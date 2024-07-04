import {Router} from 'express'
import { login, resendOtp, userSignUp, verifyOtp } from '../controllers/auth.controller.js'
const router = Router();

router.post('/sign-up', userSignUp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login)

export {router}