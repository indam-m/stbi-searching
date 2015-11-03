var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');
var fs = require('fs');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

var jsonfile = require('jsonfile');

var docURL = process.argv[2];
var queryURL = process.argv[3];
var qrelsFile = process.argv[4];
var stopwordFile = process.argv[5];

var dTF = process.argv[6];
var dIDF = (process.argv[7] === 'true');
var dNormal = (process.argv[8] === 'true');
var dStem = (process.argv[9] === 'true');

var qTF = process.argv[10];
var qIDF = (process.argv[11] === 'true');
var qNormal = (process.argv[12] === 'true');
var qStem = (process.argv[13] === 'true');

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

var av_recall = 0, av_precision = 0, av_niap = 0, n_query = 0, n_query_recall = 0, n_query_niap = 0;

var query_rank = {data : [], averages: {precision: 0, recall: 0, niap: 0}};

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

for(iQuery in qFile.file){
	console.log('Query number: ' + qFile.file[iQuery].query_number);
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
		console.log(SC[x].doc_number);
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

var outputFilename = abs_path + 'js/test3.json';

fs.writeFile(abs_path + 'js/invertedFile.json', JSON.stringify(docFile.file, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + 'js/invertedFile.json');
    }
});

fs.writeFile(outputFilename, JSON.stringify(query_rank, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
});

