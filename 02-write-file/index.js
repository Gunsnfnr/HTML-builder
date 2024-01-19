const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(path.join(__dirname, 'new.txt'));
rl.question('Hello! How are you today? ', (answer) => {
  if (answer.match(/^exit$/i)) {
    rl.close();
  } else writeStream.write(answer);
  rl.on('line', (answer) => {
    if (answer.match(/^exit$/i)) {
      rl.close();
    } else {
      writeStream.write('\n' + answer);
    }
  });
  rl.on('SIGINT', () => rl.close());
});

rl.on('close', () => {
  console.log('Writing to file completed');
});
