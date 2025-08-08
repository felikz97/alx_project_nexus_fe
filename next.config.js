module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'felikz97.pythonanywhere.com',
        port: '',
        pathname: '/media/**',
      },
      // Optional: keep localhost for local dev
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
}
