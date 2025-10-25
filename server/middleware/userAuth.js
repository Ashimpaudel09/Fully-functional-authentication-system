import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    // No token → not logged in
    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized, please login again",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.json({
        success: false,
        message: "Invalid or expired token, please login again",
      });
    }

    // Attach user ID
    if (decoded?.id) {
      req.user = { userId: decoded.id };
      return next();
    } else {
      return res.json({
        success: false,
        message: "Authorization failed, invalid payload",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
