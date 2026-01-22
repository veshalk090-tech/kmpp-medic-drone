// Authentication Middleware
// Handles JWT token verification and role-based access control

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT (change this to a strong secret!)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // Token expires in 24 hours

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User object with id and role
 * @returns {String} JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id || user._id, 
      role: user.role,
      phone: user.phone 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify JWT token
 * @param {String} token - JWT token from Authorization header
 * @returns {Object|null} Decoded token or null if invalid
 */
function verifyToken(token) {
  try {
    // Remove 'Bearer ' prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    return jwt.verify(actualToken, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to protect routes and check authentication
 * Usage: app.use('/api/protected', authMiddleware, routeHandler)
 */
function authMiddleware(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Attach user info to request object
    req.user = decoded;
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Token verification failed'
    });
  }
}

/**
 * Middleware to check if user has specific role
 * Usage: app.get('/api/nurses-only', authMiddleware, requireRole('nurse'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

/**
 * Roles configuration for the system
 */
const ROLES = {
  STUDENT: 'student',
  NURSE: 'nurse',
  PHARMACIST: 'pharmacist',
  OPERATOR: 'drone-operator',
  ADMIN: 'admin'
};

/**
 * Role permissions matrix
 * Defines what each role can do
 */
const rolePermissions = {
  student: {
    canViewOwnOrders: true,
    canCreateOrder: true,
    canViewProfile: true,
    canUploadPrescription: true,
    canCancelOrder: true
  },
  nurse: {
    canApproveOrders: true,
    canRejectOrders: true,
    canViewAllOrders: true,
    canViewAllStudents: true,
    canManageMedicines: false
  },
  pharmacist: {
    canApprovePrescriptions: true,
    canVerifyMedicines: true,
    canManageMedicines: true,
    canViewAllOrders: true,
    canPrepareOrders: true
  },
  'drone-operator': {
    canViewAvailableDrones: true,
    canAssignDrone: true,
    canLaunchDrone: true,
    canViewDeliveries: true,
    canReturnDrone: true,
    canEmergencyStop: true
  },
  admin: {
    // Admin can do everything
    '*': true
  }
};

/**
 * Middleware to check specific permission
 * Usage: app.get('/api/approve-order', authMiddleware, checkPermission('canApproveOrders'), handler)
 */
function checkPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const userRole = req.user.role;
    const permissions = rolePermissions[userRole];

    if (!permissions) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Unknown role'
      });
    }

    // Admin can do everything
    if (permissions['*'] === true) {
      return next();
    }

    if (!permissions[permission]) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `You don't have permission: ${permission}`
      });
    }

    next();
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  requireRole,
  checkPermission,
  ROLES,
  rolePermissions
};
