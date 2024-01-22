const fs = require('fs');
const path = require('path');

fs.access(path.join(__dirname, 'files-copy'), (error) => {
  if (error) {
    fs.mkdir(path.join(__dirname, 'files-copy'), (error) => {
      if (error) {
        console.log('Error found:', error);
      }
      console.log('Created files-copy directory');
      copyFiles();
    });
  } else {
    console.log('files-copy directory exists');
    fs.readdir(
      path.join(__dirname, '/files-copy'),
      { withFileTypes: true },
      (err, files) => {
        files.forEach((file) => {
          const currentFilePath = path.join(
            __dirname,
            '/files-copy/',
            file.name,
          );
          fs.unlink(currentFilePath, (error) => {
            if (error) {
              console.log('Error Found:', error);
            }
          });
        });
      },
    );
    copyFiles();
  }
});

function copyFiles() {
  fs.readdir(
    path.join(__dirname, '/files'),
    { withFileTypes: true },
    (err, files) => {
      files.forEach((file) => {
        const currentFilePath = path.join(__dirname, '/files/', file.name);
        const newFilePath = path.join(__dirname, '/files-copy/', file.name);
        fs.copyFile(currentFilePath, newFilePath, (error) => {
          if (error) {
            console.log('Error Found:', error);
          } else {
            console.log(`File ${file.name} has been copied successfully.`);
          }
        });
      });
    },
  );
}
