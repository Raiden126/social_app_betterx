export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return { otp: otp.toString(), expiresAt };
};
