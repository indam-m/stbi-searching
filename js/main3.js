var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');
var fs = require('fs');

var qrelsFile = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/ADI/qrels.text';
var docURL = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/ADI/adi.all';
var queryURL = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/ADI/query.text';
var stopwordFile = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/stopWord.txt';

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

var jsonfile = require('jsonfile');

function get_qRels(file) {
	var temp = {};
	
	fs.readFileSync(file).toString().split('\n').forEach(function (line) {
		if(line.length > 0){
			var ltemp;

			if(line.indexOf('   ') > -1)
				ltemp = line.split('   ');
			else
				ltemp = line.split(' ');

			var l0 = ltemp[0].toString();
			var l1 = ltemp[1].toString();
			var check = false;

			if(l0 in temp){
				temp[l0].push(l1);
			} else{
				temp[l0] = [l1];				
			}
		}
	});
	return temp;
}

var qRels = get_qRels(qrelsFile);

function count_precision(q_number, dFound){
	var nr_found = 0;
	var qn = q_number.toString();
	if(qRels[qn]){
		var qRelsn = qRels[qn];
		for(d in dFound){
			if(qRelsn.indexOf(dFound[d]) > -1)
				nr_found++;
		}
		if(dFound.length == 0)
			return 0;
		else
			return nr_found/dFound.length;
	}
	else
		return null;
}

function count_recall(q_number, dFound){
	var nr_found = 0;
	var qn = q_number.toString();
	if(qRels[qn]){
		var qRelsn = qRels[qn];
		for(d in dFound){
			if(qRelsn.indexOf(dFound[d]) > -1)
				nr_found++;
		}
		if(dFound.length == 0)
			return 0;
		else
			return nr_found/qRelsn.length;
	}
	else
		return null;
}

function count_niap(q_number, dFound){
	var nr_ = 0, nr_found = 0, n_found = 0;
	var qn = q_number.toString();
	if(qRels[qn]){
		var qRelsn = qRels[qn];
		for(d in dFound){
			n_found++;
			if(qRelsn.indexOf(dFound[d]) > -1){
				nr_found++;
				nr_ += nr_found/n_found;
			}
		}
		if(nr_found == 0)
			return 0;
		else
			return nr_/qRelsn.length;
	}
	else
		return null;
}

function writeExperiment(var contents){
	var content = 'Algorithm\tQuery Expansion\tSame Documents\tPrecision\tRecall\tNIAP\n';	

	for(i in contents){
		var _c = contents[i];
		content += _c['algorithm'] + '\t' + _c['qExp'] + '\t' + _c['usdc'] + '\t' + _c['precision'] + '\t' + _c['recall'] + '\t' + _c['niap'] + '\n';
	}
	return content;
}

dTFs = ['binary', 'raw', 'aug', 'log'];
dIDFs = [true, false];
dNormals = [true, false];
dStems = [true, false];

qTFs = ['binary', 'raw', 'aug', 'log'];
qIDFs = [true, false];
qNormals = [true, false];
qStems = [true, false];
var z = 0;
for(a in dTFs){
	for(b in dIDFs){
		for(c in dNormals){
			for(d in dStems){
				z++;
				var av_recall = 0, av_precision = 0, av_niap = 0, n_query = 0, n_query_recall = 0, n_query_niap = 0;
				var query_rank = {data : [], averages: {precision: 0, recall: 0, niap: 0}};

				var dTF = dTFs[a];  
				var dIDF = dIDFs[b];
				var dNormal = dNormals[c];
				var dStem = dStems[d];

				var qTF = dTFs[a];  
				var qIDF = dIDFs[b];
				var qNormal = dNormals[c];
				var qStem = dStems[d];

				var docFile = new invertedFile();
				docFile.create(docURL, stopwordFile, dTF, dIDF, dNormal, dStem);

				var qFile = new queryFile(docFile.idf);
				qFile.create(queryURL, stopwordFile, qTF, qIDF, qNormal, qStem);

				for(iQuery in qFile.file){
					// console.log('Query number: ' + qFile.file[iQuery].query_number);
					var SC = [];
					for(iDoc in docFile.file){
						var query = qFile.file[iQuery].data;
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

					for (x in SC){
						// console.log(SC[x].doc_number);
						rank.push(SC[x].doc_number);
					}
					var precision = count_precision(qFile.file[iQuery].query_number, rank);
					var recall = count_recall(qFile.file[iQuery].query_number, rank);
					var niap = count_niap(qFile.file[iQuery].query_number, rank);

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

					query_rank['data'].push({number: qFile.file[iQuery].query_number, query: qFile.file[iQuery].contents, rank: rank, 
						precision: precision, recall: recall, niap: niap});

				}

				query_rank['averages'] = {precision: av_precision/n_query, recall: av_recall/n_query_recall, niap: av_niap/n_query_niap};
				
				var exp_url = abs_path + 'testsets/exADI/' + z + '.txt';
				fs.writeFileSync(exp_url, writeExperiment(query_rank, dTF, dIDF, dNormal, dStem, qTF, qIDF, qNormal, qStem));

				console.log(z);
			}
		}
	}
}