const fs = require('fs');
const path = require('path');
let templateHtmlContent = '';

fs.access(path.join(__dirname, 'project-dist'), (error) => {
  function makeDir() {
    fs.mkdir(path.join(__dirname, 'project-dist'), (error) => {
      if (error) {
        console.log('makeDir Error found:', error);
      }
      console.log('Created project-dist directory');
    });
  }
  if (error) {
    console.log('no dir');
    makeDir();
    handleCss()
  } else {
    console.log('dir exists');
    handleCss();
    // fs.rm(
    //   path.join(__dirname, 'project-dist'),
    //   { recursive: true },
    //   (error) => {
    //     console.log('deleting folder');
    //     if (error) {
    //       console.log('rm Error found:', error);
    //     }
    //   },
    // );
    // makeDir();
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
          console.log('Reading HTML file ' + currentFilePath);
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
            console.log('Reading CSS file ' + currentFilePath);
            const cssChunk = await promise;
            writeStreamCss.write(cssChunk);
          }
        }
        fillFile();
      });
    });
}
