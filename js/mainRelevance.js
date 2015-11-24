var relevance = require('./RelevanceFeedback');
var jsonfile = require('jsonfile');
var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

var allQuery = jsonfile.readFileSync(abs_path + 'js/queryWeight.json', {throws: false});
var invertedFile = jsonfile.readFileSync(abs_path + 'js/invertedFile.json', {throws: false});

var relevantDocs = [55,64,71,12];
var irrelevantDocs = [61,1,41,7];
var algorithm = 'rocchio'; //rocchio/regular/dechi
var expand = true; //true/false
var topS = 10;




var newQuery = []
var t = new Date().getTime();

for(i in allQuery){
	var init = new Date().getTime();

	var temp = new relevance(invertedFile, allQuery[i], relevantDocs,irrelevantDocs,algorithm,expand);	
	newQuery.push(temp);
	console.log((new Date().getTime()-init)/1000);
}
var f = new Date().getTime();
console.log((f - t)/1000);
jsonfile.writeFileSync(abs_path + 'js/temp.json', newQuery, {throws:false});