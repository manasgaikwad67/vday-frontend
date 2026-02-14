const jwt = require("jsonwebtoken");

// Verify creator (logged in user who created the page)
const verifyCreator = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isCreator || !decoded.userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    req.userId = decoded.userId;
    req.isCreator = true;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Verify partner entry (the person viewing the page)
const verifyPartner = (req, res, next) => {
  try {
    const token = req.headers["x-entry-token"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Entry required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({ success: false, message: "Invalid entry" });
    }
    req.userId = decoded.userId;
    req.isPartner = decoded.isPartner || false;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid entry token" });
  }
};

// Verify either creator or partner (for accessing content)
const verifyAccess = (req, res, next) => {
  try {
    // First try creator token
    const authToken = req.headers.authorization?.split(" ")[1];
    if (authToken) {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      if (decoded.userId) {
        req.userId = decoded.userId;
        req.isCreator = decoded.isCreator || false;
        return next();
      }
    }

    // Then try partner entry token
    const entryToken = req.headers["x-entry-token"];
    if (entryToken) {
      const decoded = jwt.verify(entryToken, process.env.JWT_SECRET);
      if (decoded.userId) {
        req.userId = decoded.userId;
        req.isPartner = decoded.isPartner || false;
        return next();
      }
    }

    return res.status(401).json({ success: false, message: "Authentication required" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Legacy admin verification (kept for backwards compatibility)
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both old admin tokens and new creator tokens
    if (decoded.isAdmin) {
      req.admin = decoded;
      return next();
    }
    
    if (decoded.isCreator && decoded.userId) {
      req.userId = decoded.userId;
      req.isCreator = true;
      return next();
    }
    
    return res.status(403).json({ success: false, message: "Not authorized" });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Legacy entry verification (kept for backwards compatibility)
const verifyEntry = (req, res, next) => {
  try {
    const token = req.headers["x-entry-token"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Entry required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid entry token" });
  }
};

module.exports = { verifyAdmin, verifyEntry, verifyCreator, verifyPartner, verifyAccess };
