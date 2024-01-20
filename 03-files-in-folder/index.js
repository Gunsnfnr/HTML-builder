const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, '/secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    files.forEach((file) => {
      const currentFilePath = path.join(
        __dirname,
        '/secret-folder/',
        file.name,
      );
      fs.stat(currentFilePath, (err, stats) => {
        const justAName = path.parse(currentFilePath).name;
        const extension = path.extname(currentFilePath);
        const extWithoutDot = extension.slice(1);
        const sizeInKb = stats.size / 1024;
        const sizeRounded = sizeInKb.toFixed(3) + 'kB';
        if (!stats.isDirectory()) {
          console.log(`${justAName} - ${extWithoutDot} - ${sizeRounded}`);
        }
      });
    });
  },
);
