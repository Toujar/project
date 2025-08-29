// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import connectDB from '../lib/mongodb.js';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// export const authenticateToken = async (req) => {
//   try {
//     const token = req.cookies?.token;
    
//     if (!token) {
//       return { error: 'Access denied. No token provided.' };
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
    
//     await connectDB();
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return { error: 'Invalid token.' };
//     }

//     return { user };
//   } catch (error) {
//     return { error: 'Invalid token.' };
//   }
// };

// export const requireRole = (allowedRoles) => {
//   return async (req) => {
//     const authResult = await authenticateToken(req);
    
//     if (authResult.error) {
//       return authResult;
//     }

//     if (!allowedRoles.includes(authResult.user.role)) {
//       return { error: 'Access denied. Insufficient permissions.' };
//     }

//     return authResult;
//   };
// };
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import connectDB from '../lib/mongodb.js';
import { cookies } from "next/headers";


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Authenticate the JWT token from cookies
 */
export const authenticateToken = async (req) => {
  try {
    await connectDB();
    const cookieStore = cookies();
const token = cookieStore.get("token")?.value;

    // const token = req.cookies?.token;

    if (!token) {

      return { error: 'Access denied. No token provided.', status: 401 };
    }

    let decoded;
    try {
      // console.log("token:", token)
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return { error: 'Invalid or expired token.', status: 403 };
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return { error: 'User not found.', status: 404 };
    }

    return { user };
  } catch (err) {
    console.error('Auth error:', err);
    return { error: 'Authentication failed.', status: 500 };
  }
};

/**
 * Check if the user has the required role
 */
export const requireRole = (allowedRoles) => {
  return async (req) => {
    const authResult = await authenticateToken(req);

    if (authResult.error) {
      return authResult;
    }

    const userRole = authResult.user.role;
    if (!allowedRoles.includes(userRole)) {
      return { error: 'Access denied. Insufficient permissions.', status: 403 };
    }

    return authResult;
  };
};
