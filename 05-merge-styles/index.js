const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(
  path.join(__dirname, '/project-dist/', 'bundle.css'),
);

fs.promises
  .readdir(path.join(__dirname, '/styles'), { withFileTypes: true })
  .then((files) => {
    let index = 0;
    files.forEach((file) => {
      const currentFilePath = path.join(__dirname, '/styles/', file.name);
      const extension = path.extname(currentFilePath).slice(1);
      async function fillContainer() {
        let promise = new Promise((resolve) => {
          fs.readFile(currentFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            resolve(data);
          });
        });
        if (extension === 'css') {
          console.log('Reading css file ' + currentFilePath);
          const cssChunk = await promise;
          writeStream.write(cssChunk);
          index = index + 1;
        }
      }
      fillContainer();
    });
  });
