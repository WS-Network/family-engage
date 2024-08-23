const { secret } = require('config.json');
const db = require('_helpers/db');
const { expressjwt: expressJwt } = require('express-jwt');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req, res, next) => {
            try {
                // Check if req.user is defined
                if (!req.user || !req.user.id) {
                    return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
                }

                const account = await db.Account.findByPk(req.user.id);

                if (!account || (roles.length && !roles.includes(account.role))) {
                    // account no longer exists or role not authorized
                    return res.status(401).json({ message: 'Unauthorized: Account does not exist or role not authorized' });
                }

                // authentication and authorization successful
                req.user.role = account.role;
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
                next();
            } catch (error) {
                // Handle unexpected errors
                console.error('Authorization error:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    ];
}
