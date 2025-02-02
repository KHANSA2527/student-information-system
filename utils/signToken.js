import jwt from 'jsonwebtoken'

const signToken = (id) => {
    const token = jwt.sign(
        {id}, process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRES_IN}
    )
    return token;
}

export {signToken}