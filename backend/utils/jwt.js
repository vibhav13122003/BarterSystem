export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    const cookieName = user.role === "Admin" ? "adminToken" : "clientToken";

    const expiresIn = process.env.COOKIE_EXPIRE || '7d';

    res.status(statusCode).cookie(cookieName, token, {
        expires: new Date(Date.now() + parseDurationToMilliseconds(expiresIn)),
        httpOnly: true,
    }).json({
        success: true,
        message,
        user,
        token
    });
};

const parseDurationToMilliseconds = (duration) => {
    const units = {
        'ms': 1,
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000,
    };

    const parsedDuration = /^([\d.]+)([smhd])$/.exec(duration);
    if (!parsedDuration) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const [, value, unit] = parsedDuration;
    const milliseconds = parseFloat(value) * units[unit];
    if (isNaN(milliseconds)) {
        throw new Error(`Invalid duration value: ${value}`);
    }

    return milliseconds;
};
