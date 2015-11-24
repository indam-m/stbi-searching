var Relevance = require('./MainRelevance');
var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');

var fs = require('fs');
var jsonfile = require('jsonfile');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

var algorithm = process.argv[4]; //rocchio/regular/dechi
var usdc = (process.argv[5] === 'true'); //true/false
var topS = process.argv[6];
var expand = (process.argv[7] === 'true'); //true/false
var topN = -1;
if(algorithm === 'pseudo'){
	topN = process.argv[8];
	algorithm = 'rocchio';
}

var _allDocs = process.argv[2].substring(1);
var _relevant = process.argv[3].substring(1);

var _irrelevant = _allDocs.split('~');
var relevant = _relevant.split('~');
var irrelevant = [];

for(i in _irrelevant){
	if(relevant.indexOf(_irrelevant[i]) == -1){
		irrelevant.push(_irrelevant[i]);
	}
}
relevantDocs = [];
irrelevantDocs = [];
relevantDoc = {
	queryNumber: 0,
	docs: relevant
};
irrelevantDoc = {
	queryNumber: 0,
	docs: irrelevant
};

relevantDocs.push(relevantDoc);
irrelevantDocs.push(irrelevantDoc);	

var test = {
	algorithm: algorithm,
	usdc: usdc,
	topS: topS,
	topN: topN,
	expand: expand,
	relevantDocs: relevantDocs,
	irrelevantDocs: irrelevantDocs
}

jsonfile.writeFileSync(abs_path + 'js/test.json', test, {throws:false});
var docFile = jsonfile.readFileSync(abs_path + 'js/invertedFile.json', {throws: false}); 
var newQuery = new Relevance(relevantDocs, irrelevantDocs, algorithm, usdc, topS, expand);

for(iQuery in newQuery){
	console.log('Query number: ' + newQuery[iQuery].query_number);
	var SC = [];
	for(iDoc in docFile){
		var query = newQuery[iQuery].data;
		var doc = docFile[iDoc].data;
		var sim = 0;
		for(i in query){
			for(j in doc){
				if(doc[j].word === query[i].word){
					sim += doc[j].weight * query[i].weight;
				}
			}
		}
		if(sim > 0){
			SC.push({doc_number: docFile[iDoc].doc_number, value: sim, title: docFile[iDoc].title});
		}
	}

	SC.sort(function(a, b) {
	    return parseFloat(b.value) - parseFloat(a.value);
	});

	var rank = [];
	var count = 0;
	for (x in SC){
		count += 1;
		console.log(SC[x].doc_number);
		rank.push([SC[x].doc_number, SC[x].title]);
		if(count >= topS){
			break;
		}
	}
}
var int_file = {query:newQuery[0].contents, sum: rank.length, rank: rank};

fs.writeFileSync(abs_path + 'js/new_interactive_result.json', JSON.stringify(int_file, null, 4));