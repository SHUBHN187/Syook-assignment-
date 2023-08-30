

const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace with the path to your main entry file
  output: {
    filename: 'bundle.js', // The name of the output bundle file
    path: path.resolve(__dirname, 'dist'), // The directory where the bundle will be generated
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'), // Provide a fallback for the 'stream' module
    },
  },
};
