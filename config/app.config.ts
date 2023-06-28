export const appConfig = () => ({
  port: +process.env.PORT || 3030,
  nodeEnv: process.env.NODE_ENV,
});
