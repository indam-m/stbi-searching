var Relevance = require('./MainRelevance');
var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');

var fs = require('fs');
var jsonfile = require('jsonfile');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

//relevance judgement

var newQuery = new Relevance(relevantDocs, irrelevantDocs, algorithm, usdc, topS, expand);

var av_recall = 0, av_precision = 0, av_niap = 0, n_query = 0, n_query_recall = 0, n_query_niap = 0;

var query_rank = {data : [], averages: {precision: 0, recall: 0, niap: 0}};

for(iQuery in newQuery){
	var SC = [];
	for(iDoc in docFile.file){
		var query = newQuery[iQuery].data;
		var doc = docFile.file[iDoc].data;
		var sim = 0;
		for(i in query){
			for(j in doc){
				if(doc[j].word === query[i].word){
					sim += doc[j].weight * query[i].weight;
				}
			}
		}
		if(sim > 0){
			SC.push({doc_number: docFile.file[iDoc].doc_number, value: sim});
		}
	}

	SC.sort(function(a, b) {
	    return parseFloat(b.value) - parseFloat(a.value);
	});

	var rank = [];

	var count = 0;
	if(!usdc){
		for (x in SC){
			var idx = -1;
			for(y in firstRetrieve){
				if(newQuery[iQuery].query_number == firstRetrieve[y].number){
					idx = y;
				}
			}
			if(firstRetrieve[idx].rank.indexOf(SC[x].doc_number) == -1){
				count += 1;
				rank.push(SC[x].doc_number);
				if(count >= topS){
					break;
				}
			}
		}
	}
	else{
		for (x in SC){
			count += 1;
			rank.push(SC[x].doc_number);
			if(count >= topS){
				break;
			}
		}
	}
	var precision = count_precision(newQuery[iQuery].query_number, rank);
	var recall = count_recall(newQuery[iQuery].query_number, rank);
	var niap = count_niap(newQuery[iQuery].query_number, rank);

	if(precision){
		av_precision += precision;
		n_query++;
	}

	if(recall){
		av_recall += recall;
		n_query_recall++;
	}

	if(niap){
		av_niap += niap;
		n_query_niap++;
	}

	query_rank['data'].push({number: newQuery[iQuery].query_number, query: newQuery[iQuery].contents, rank: rank, 
		precision: precision, recall: recall, niap: niap});

}

query_rank['averages'] = {precision: av_precision/n_query, recall: av_recall/n_query_recall, niap: av_niap/n_query_niap};

var outputFilename = abs_path + 'js/2ndRetreive.json';
fs.writeFileSync(outputFilename, JSON.stringify(query_rank, null, 4));