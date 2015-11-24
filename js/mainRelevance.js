var relevance = require('./RelevanceFeedback');
var jsonfile = require('jsonfile');

function MainRelevance(rDocs, irDocs, algo, sameDocs, s, qExpand){
	var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

	var allQuery = jsonfile.readFileSync(abs_path + 'js/queryWeight.json', {throws: false});
	var invertedFile = jsonfile.readFileSync(abs_path + 'js/invertedFile.json', {throws: false});

	var relevantDocs = rDocs;
	var irrelevantDocs = irDocs;
	var algorithm = algo; //rocchio/regular/dechi
	var usdc = sameDocs; //true/false
	var topS = s;
	var expand = qExpand; //true/false

	var newQuery = [];
	var t = new Date().getTime();

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
	jsonfile.writeFileSync(abs_path + 'js/newQueryWeight.json', newQuery, {throws:false});
}

module.exports = MainRelevance;