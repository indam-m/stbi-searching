var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');
var fs = require('fs');
var jsonfile = require('jsonfile');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';
var stopwordFile = abs_path + 'testsets/stopWord.txt';
var queryURL = abs_path + 'testsets/query.txt';

// var query = "What problems and concerns are there in making up descriptive titles? What difficulties are involved in automatically retrieving articles from  approximate titles? What is the usual relevance of the content of articles to their titles?";
var re = new RegExp('~', 'g');
var query = process.argv[2].replace(re, ' ');
var new_query = ".I 0\n.W\n" + query;

fs.writeFileSync(queryURL, new_query);

var docFile = jsonfile.readFileSync(abs_path + 'js/invertedFile.json', {throws: false}); 
var idf_file = jsonfile.readFileSync(abs_path + 'js/idf.json', {throws: false}); 
var setting = jsonfile.readFileSync(abs_path + 'js/setting.json', {throws: false}); 


var dTF = setting.TF; //raw/aug/log/binary
var dIDF = setting.IDF; //true/false
var dNormal = setting.Normal; //true/false
var dStem = setting.Stem; //true/false/


var qFile = new queryFile(idf_file);
qFile.create(queryURL, stopwordFile, dTF, dIDF, dNormal, dStem);

console.log(qFile.file[0].data);

for(iQuery in qFile.file){
	console.log('Query number: ' + qFile.file[iQuery].query_number);
	var SC = [];
	for(iDoc in docFile){
		var query = qFile.file[iQuery].data;
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

	for (x in SC){
		console.log(SC[x].doc_number);
		rank.push([SC[x].doc_number, SC[x].title]);
	}
}
var int_file = {sum: rank.length, rank: rank};

fs.writeFileSync(abs_path + 'js/interactive_result.json', JSON.stringify(int_file, null, 4));
