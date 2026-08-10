import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { ERROR_STATUS_CODE, ERROR_MESSAGES } from '../constants/errors';
import logger from '../config/logger';

class UserController {
  constructor(service, config) {
    this._service = service;
    this._config = config;

    this.createUser = this.createUser.bind(this);
    this.login = this.login.bind(this);
    this.passwordReset = this.passwordReset.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  _getTokenAndExpiry(userDetails) {
    const payloadSign = {
      'x-user-id': userDetails.userId,
      fullName: userDetails.fullName,
      email: userDetails.email,
    };
    const expiresIn = 3600000;
    const token = jwt.sign(payloadSign, this._config.publicKey, { expiresIn: `${expiresIn}s` });
    const tokenExpiry = Date.now() + expiresIn;

    return { token, tokenExpiry };
  }

  async createUser(req, res) {
    try {
      const { email, password, fullName, dateOfBirth } = req.body;
      const isUserExist = await this._service.findOne({ email });

      if (isUserExist) {
        return res.status(401).json({ message: 'User already exist. Try login instead! ' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const uuid = uuidv4();

      const user = await this._service.createUser({
        email,
        userId: uuid,
        password: hashedPassword,
        fullName,
        dateOfBirth,
      });

      logger.info(`[INFO] Successfully created a new user with ID: ${uuid}`);

      const { token, tokenExpiry } = this._getTokenAndExpiry(user);

      return res.status(200).json({ token, expiresIn: tokenExpiry });
    } catch (error) {
      logger.error(`Error during user registration: ${error.message}`);

      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this._service.findOne({ email });

      if (!user) {
        logger.error(`count with email ${email} not found`);

        return res.status(404).json({ message: 'Account not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { token, tokenExpiry } = this._getTokenAndExpiry(user);

      return res.status(200).json({ token, expiresIn: tokenExpiry });
    } catch (error) {
      logger.error(`Error during login: ${error.message}`);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  async passwordReset(req, res) {
    try {
      const userId = req['x-user-id'];
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      if (currentPassword === confirmPassword) {
        return res
          .status(400)
          .json({ message: 'New password cannot be the same with old password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this._service.findOneAndUpdate({ userId }, { password: hashedPassword });

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (passwordMatch) {
        return res.status(400).json({ message: 'Invalid current password' });
      }

      const { token, tokenExpiry } = this._getTokenAndExpiry(user);
      logger.info({ userId }, '[INFO] Success update password');

      return res.status(200).json({ token, expiresIn: tokenExpiry });
    } catch (error) {
      logger.error(`Error during password reset: ${error.message}`);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req['x-user-id'];
      const user = await this._service.findOne({ userId });

      if (!user) {
        return res.status(ERROR_STATUS_CODE.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      logger.info(`Successfully retrieved profile for user ID: ${userId}`);

      return res.status(200).json(user);
    } catch (error) {
      logger.error(`Error during profile retrieval: ${error.message}`);
      return res.status(500).json({ message: 'INTERNAL_SERVER_ERROR' });
    }
  }
}

module.exports = UserController;
