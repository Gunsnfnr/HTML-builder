const fs = require('fs');
const path = require('path');
let templateHtmlContent = '';

fs.access(path.join(__dirname, 'project-dist'), (error) => {
  if (error) {
    fs.mkdir(path.join(__dirname, 'project-dist'), (error) => {
      if (error) {
        console.log('Error found:', error);
      }
      console.log('Created project-dist directory');
    });
  } else {
    console.log('project-dist directory exists');
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
          console.log('Reading file ' + currentFilePath);
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
