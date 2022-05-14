module.exports = {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api",
  tokenSecret: process.env.TOKEN_SECRET || 'SECRET',
  port: process.env.PORT || 5858
};
