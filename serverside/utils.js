var fs = require('fs');

function readTextFile(file)
{
    return fs.readFileSync(file, 'utf8');
}

module.exports = {
  readTextFile: readTextFile
}