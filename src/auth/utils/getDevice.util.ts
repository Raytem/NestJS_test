export const getDevice = (userAgent: string) => {
  return userAgent.match(/\((.+?)\)/)[1];
};
