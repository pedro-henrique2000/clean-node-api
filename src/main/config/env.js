module.exports = {
  mongoUrl: process.env.MONGO_URL || "mongodb://root:root@localhost:27017/clean-node-api?authSource=admin",
  tokenSecret: process.env.TOKEN_SECRET || 'SECRET',
  port: process.env.PORT || 5858
};
