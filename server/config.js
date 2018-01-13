const config = {
  mongoURL: process.env.MONGODB_URI || 'mongodb://nick:password@ds163294.mlab.com:63294/react-testing',
  port: process.env.PORT || 8000,
};

export default config;
