/* inverted files */

var invertedFile = require('./InvertedFile');

file = new invertedFile();
file.readFile('../testsets/CISI/cisi.all');
file.readFile('../testsets/ADI/adi.all');
file.create();
for(i in file.file){
    console.log(file.file[i]);
}
// var x = 82
// console.log(file.file[x]);
// for(i in file.file[x].data){
//  console.log(file.file[x].data[i].raw_tf);
// }