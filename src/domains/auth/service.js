const User = require('../user/model');
const AuthUtils = require('../../core/utils/auth.utils');

class AuthService {
    async register(userData) {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already exists');
            }

            const user = await User.create(userData);
            const token = AuthUtils.generateToken(user);

            return {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const token = AuthUtils.generateToken(user);

            return {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();
