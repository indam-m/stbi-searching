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
	
	var newQueries = [];

	for(i in allQuery){
		var idx = -1;
		for(j in relevantDocs){
			if(relevantDocs[j].queryNumber == allQuery[i].query_number){
				idx = j;
				break;
			}
		}

		var temp = new relevance(invertedFile, allQuery[i], relevantDocs[idx].docs,irrelevantDocs[idx].docs,algorithm,expand);	
		newQueries.push(temp);
	}
	jsonfile.writeFileSync(abs_path + 'js/newQueryWeight.json', newQueries, {throws:false});

	return newQueries;

}

module.exports = MainRelevance;