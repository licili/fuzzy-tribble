let fs = require('fs');
let path = require('path');
let r = fs.readFileSync(path.resolve(__dirname, './materias/wx2.png'));
console.log(r);