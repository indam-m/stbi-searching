var Relevance = require('./MainRelevance');
var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');

var fs = require('fs');
var jsonfile = require('jsonfile');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

var docURL = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/CISI/cisi.all';
var queryURL = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/CISI/query.text';
var qrelsFile = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/CISI/qrels.text';
var stopwordFile = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/testsets/stopWord.txt';

var dTF = 'raw';
var dIDF = false;
var dNormal = false;
var dStem = true;

var qTF = dTF;
var qIDF = dIDF;
var qNormal = dNormal;
var qStem = dStem;
var topS = 25;

var algorithms = ['rocchio', 'regular', 'dechi', 'pseudo']; //rocchio/regular/dechi

var usdcs = [true, false]; //true/false
var expands = [true, false]; //true/false
var topN = -1;
if(algorithm === 'pseudo'){
	topN = 5;
	algorithm = 'rocchio';
}

var setting = {
	TF: dTF,
	IDF: dIDF,
	Normal: dNormal,
	Stem: dStem
}

jsonfile.writeFileSync(abs_path + 'js/setting.json', setting, {throws:false});

//Buat inverted file dokumen
var docFile = new invertedFile();
docFile.create(docURL, stopwordFile, dTF, dIDF, dNormal, dStem);
jsonfile.writeFileSync(abs_path + 'js/idf.json', docFile.idf, {throws:false});

//Ngitung bobot kata tiap query
var qFile = new queryFile(docFile.idf);
qFile.create(queryURL, stopwordFile, qTF, qIDF, qNormal, qStem);


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

function writeExperiment(contents){
	var content = ''; 

	for(i in contents){
		var _c = contents[i];
		content += 'Algorithm\t' + _c['algo'] + '\n';
		content += 'Query Expansion\t' + _c['qExp'] + '\n';
		content += 'Same Documents\t' + _c['sd'] + '\n\n';
		content += ' \tBefore\tAfter\n';
		content += 'Precision\t' + _c['b_precision'] + '\t' + _c['a_precision'] + '\n';
		content += 'Recall\t' + _c['b_recall'] + '\t' + _c['a_recall'] + '\n';
		content += 'NIAP\t' + _c['b_niap'] + '\t' + _c['a_niap'] + '\n\n\n';

	}
	return content;
}

var thecontents = [];
var __i = 0;

for(ii in algorithms){
	for(jj in usdcs){
		for(kk in expands){
			var av_recall = 0, av_precision = 0, av_niap = 0, n_query = 0, n_query_recall = 0, n_query_niap = 0;

			var query_rank = {data : [], averages: {precision: 0, recall: 0, niap: 0}};
			var algorithm = algorithms[ii];
			var usdc = usdcs[jj];
			var expand = expands[kk];

			var baris = {
				algo: algorithm,
				qExp: expand,
				sd: usdc,
				b_precision: 0,
				b_recall: 0,
				b_niap: 0,
				a_precision: 0,
				a_recall: 0,
				a_niap: 0
			};

			for(iQuery in qFile.file){
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

				var count = 0;
				for (x in SC){
					count += 1;
					rank.push(SC[x].doc_number);
					if(count >= topS){
						break;
					}
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

			baris['b_precision'] = query_rank['averages']['precision'];
			baris['b_recall'] = query_rank['averages']['recall'];
			baris['b_niap'] = query_rank['averages']['niap'];

			var relevantDocs = [];
			var irrelevantDocs = [];
			if(topN == -1){
				for(p in query_rank.data){
					relevantDoc = {
						queryNumber: query_rank.data[p].number,
						docs: []
					};
					irrelevantDoc = {
						queryNumber: query_rank.data[p].number,
						docs: []
					}
					for(q in query_rank.data[p].rank){
						var qrelsqn = qRels[query_rank.data[p].number];
						if(qrelsqn && qrelsqn.indexOf(query_rank.data[p].rank[q]) > -1){
							relevantDoc.docs.push(query_rank.data[p].rank[q]);
						}
						else{
							irrelevantDoc.docs.push(query_rank.data[p].rank[q]);
						}
					}
					relevantDocs.push(relevantDoc);
					irrelevantDocs.push(irrelevantDoc);
				}
			}
			else{
				for(p in query_rank.data){
					relevantDoc = {
						queryNumber: query_rank.data[p].number,
						docs: query_rank.data[p].rank.slice(0,topN)
					};
					irrelevantDoc = {
						queryNumber: query_rank.data[p].number,
						docs: query_rank.data[p].rank.slice(topN)
					};
					relevantDocs.push(relevantDoc);
					irrelevantDocs.push(irrelevantDoc);	
				}
			}

			var firstRetrieve = query_rank.data;

			var outputFilename = abs_path + 'js/test3.json';

			fs.writeFileSync(abs_path + 'js/invertedFile.json', JSON.stringify(docFile.file, null, 4));
			fs.writeFileSync(outputFilename, JSON.stringify(query_rank, null, 4));

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

			baris['a_precision'] = query_rank['averages']['precision'];
			baris['a_recall'] = query_rank['averages']['recall'];
			baris['a_niap'] = query_rank['averages']['niap'];

			var outputFilename = abs_path + 'js/2ndRetreive.json';
			fs.writeFileSync(outputFilename, JSON.stringify(query_rank, null, 4));

			thecontents.push(baris);

			__i++;
			console.log(__i + ' ' + algorithm + ' afpre ' + query_rank['averages']['precision']);

		}
	}
}

fs.writeFileSync(abs_path + 'testsets/xADI/cisi.txt', writeExperiment(thecontents));