const fs = require('fs');
const path = require('path');
let templateHtmlContent = '';
const pathToAssets = path.join(__dirname, 'assets');

function makeDir(pathToDir) {
  fs.mkdir(pathToDir, { recursive: true }, (error) => {
    if (error) {
      console.log('Error found:', error);
    }
    console.log('Created directory ', pathToDir);
  });
}

fs.access(path.join(__dirname, 'project-dist'), (error) => {
  if (error) {
    const projectDistPath = path.join(__dirname, 'project-dist');
    makeDir(projectDistPath);
    const projectDistPathAssets = path.join(
      __dirname,
      'project-dist',
      'assets',
    );
    makeDir(projectDistPathAssets);
    handleCss();
    copyAssets(pathToAssets);
  } else {
    handleCss();
    copyAssets(pathToAssets);
  }
});

const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), {
  encoding: 'utf8',
});

readStream.on('data', (dataChunk) => {
  templateHtmlContent = dataChunk;
  fs.promises
    .readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const currentFilePath = path.join(__dirname, 'components', file.name);
        const filename = path.parse(currentFilePath).name;
        fs.readFile(currentFilePath, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }
          const componentContent = data;
          console.log('Copying HTML file ' + currentFilePath);
          const templateTag = '{{' + filename + '}}';
          templateHtmlContent = templateHtmlContent.replace(
            templateTag,
            componentContent,
          );
          const writeStream = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'index.html'),
          );
          writeStream.write(templateHtmlContent);
        });
      });
    });
});

function handleCss() {
  const writeStreamCss = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );

  fs.promises
    .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const currentFilePath = path.join(__dirname, 'styles', file.name);
        const extension = path.extname(currentFilePath).slice(1);
        async function fillFile() {
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
            console.log('Copying CSS file ' + currentFilePath);
            const cssChunk = await promise;
            writeStreamCss.write(cssChunk);
          }
        }
        fillFile();
      });
    });
}

function copyAssets(dirname) {
  fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      const currentFilePath = path.join(dirname, file.name);
      const newFilePath = path.join(
        currentFilePath.split('06-build-page')[0],
        '06-build-page',
        'project-dist',
        currentFilePath.split('06-build-page')[1],
      );
      if (file.isDirectory()) {
        makeDir(newFilePath);
        copyAssets(currentFilePath);
      } else {
        fs.copyFile(currentFilePath, newFilePath, (error) => {
          if (error) {
            console.log('Error Found:', error);
          } else {
            console.log(`File ${file.name} has been copied successfully.`);
          }
        });
      }
    });
  });
}
