import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import JwtTokenManager from '../JwtTokenManager.js';
import config from '../../../Commons/config.js';

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(mockJwtToken.sign).toBeCalledWith(payload, config.auth.accessTokenKey);
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'dicoding',
      };
      const mockJwtToken = {
        sign: vi.fn().mockImplementation(() => 'mock_token'),
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(mockJwtToken.sign).toBeCalledWith(payload, config.auth.refreshTokenKey);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError);
    });

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(jwt);
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError);
    });

    // it('should throw InvariantError when verification failed', async () => {
    //   // Arrange
    //   const jwtTokenManager = new JwtTokenManager({}); // Pakai dummy object
    //   // Action & Assert (Kirim token ngarang)
    //   await expect(jwtTokenManager.verifyRefreshToken('token_ngarang'))
    //     .rejects.toThrowError(InvariantError);
    // });
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const mockJwt = {
        verify: () => { throw new Error('mock error'); }, // Sengaja dibikin error
      };
      const jwtTokenManager = new JwtTokenManager(mockJwt);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken('dummy_token'))
        .rejects.toThrowError(InvariantError);
    });
  });

  describe('verifyAccessToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const mockJwt = {
        verify: () => { throw new Error('mock error'); }, // Sengaja dibikin error biar masuk catch
      };
      const jwtTokenManager = new JwtTokenManager(mockJwt);

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken('dummy_token'))
        .rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when access token verified', async () => {
      // Arrange
      // Kita pakai jwt asli bawaan jsonwebtoken buat ngetes sukses
      const jwtTokenManager = new JwtTokenManager(jwt);
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

      // Action & Assert
      await expect(jwtTokenManager.verifyAccessToken(accessToken))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const artifacts = {
        decoded: {
          payload: {
            username: 'dicoding',
          },
        },
      };

      // Kita bikin objek palsu yang niru library pembuat token
      const mockJwt = {
        decode: vi.fn().mockImplementation(() => artifacts), // kalau kamu pakai vitest, ganti jest jadi vi
      };

      const jwtTokenManager = new JwtTokenManager(mockJwt);

      // Action
      const payload = await jwtTokenManager.decodePayload('dummy_token');

      // Assert
      expect(mockJwt.decode).toHaveBeenCalledWith('dummy_token');
      expect(payload).toStrictEqual(artifacts);
    });
  });

  // describe('decodePayload function', () => {
  //   it('should decode payload correctly', async () => {
  //     // Arrange
  //     const jwtTokenManager = new JwtTokenManager(jwt);
  //     const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });

  //     // Action
  //     const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken);

  //     // Action & Assert
  //     expect(expectedUsername).toEqual('dicoding');
  //   });
  // });
});