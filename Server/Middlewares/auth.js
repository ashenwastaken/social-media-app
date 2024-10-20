import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        let token = req.headers["authorization"]; 
        if (!token) {
            return res.status(403).json({ message: "You are not authenticated" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
