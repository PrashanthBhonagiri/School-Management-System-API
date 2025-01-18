const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { envConfig } = require('../../config');

class AuthUtils {
    static generateToken(user) {
        return jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role 
            },
            envConfig.jwt.secret,
            { expiresIn: envConfig.jwt.expiresIn }
        );
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }

    static async comparePasswords(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}

module.exports = AuthUtils;
