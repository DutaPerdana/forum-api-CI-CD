/* istanbul ignore file */
import jwt from 'jsonwebtoken'; 
import JwtTokenManager from '../../security/JwtTokenManager.js';
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication');
    }

    const token = authHeader.split(' ')[1];

    try {
      const jwtTokenManager = new JwtTokenManager(jwt);
      await jwtTokenManager.verifyAccessToken(token);

      const { id } = await jwtTokenManager.decodePayload(token);

      req.user = { id };
      next();
    } catch (error) {
      // Tangkap error dari JwtTokenManager dan ubah jadi AuthenticationError (401)
      throw new AuthenticationError('Token tidak valid');
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;