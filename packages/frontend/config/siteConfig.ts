export const siteConfig = {
  snapId: 'local:http://localhost:8081/',
  snapVersion: process.env.REACT_APP_SNAP_VERSION
    ? process.env.REACT_APP_SNAP_VERSION
    : '*',
  minSnapVersion: process.env.REACT_APP_MIN_SNAP_VERSION
    ? process.env.REACT_APP_MIN_SNAP_VERSION
    : '0.3.0',
};
