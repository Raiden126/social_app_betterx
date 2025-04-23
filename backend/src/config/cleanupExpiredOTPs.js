import cron from 'node-cron';
import User from '../models/user.model.js';

export const cleanupExpiredOTPs = () => {
    cron.schedule('*/5 * * * *', async () => {
        const now = new Date();
        try {
            const result = await User.updateMany(
                { "otp.expiresAt": { $lt: now } },
                { $set: { "otp": { code: null, expiresAt: null } } }
            );
            if(result.modifiedCount > 0) {
                console.log(`Cleaned up ${result.modifiedCount} expired OTPs`);
            }
        } catch (err) {
            console.error('Error cleaning expired OTPs:', err.message);
        }
    });
};

export const cleanupExpiredResetTokens = () => {
    cron.schedule('*/10 * * * *', async () => {
      const now = new Date();
      try {
        const result = await User.updateMany(
          { "resetPasswordToken.expiresAt": { $lt: now } },
          { $set: { 'resetPasswordToken.token': null, 'resetPasswordToken.expiresAt': null } }
        );
        if (result.modifiedCount > 0) {
          console.log(`Cleaned up ${result.modifiedCount} expired reset tokens`);
        }
      } catch (err) {
        console.error('Error cleaning expired reset tokens:', err.message);
      }
    });
};
