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
