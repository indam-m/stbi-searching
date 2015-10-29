var invertedFile = require('./InvertedFile');
var queryFile = require('./QueryFile');
var fs = require('fs');

var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

// file.readFile('../testsets/CISI/cisi.all');
// file.readFile('../testsets/ADI/adi.all');
//node lala.js document query relevance stopword docTF docIDF docNormalisation docStemming qTF qIDF qNormalisation qStemming

// var docURL = abs_path + 'testsets/ADI/adi.all';
// var queryURL = abs_path + 'testsets/ADI/query.text';
// var qrelsFile = abs_path + 'testsets/ADI/qrels.text';
// var stopwordFile = abs_path + 'testsets/stopWord.txt';

var docURL = process.argv[2];
var queryURL = process.argv[3];
var qrelsFile = process.argv[4];
var stopwordFile = process.argv[5];

// var dTF = 'aug'; //raw/aug/log/binary
// var dIDF = true; //true/false
// var dNormal = false; //true/false
// var dStem = false; //true/false/

var dTF = process.argv[6];
var dIDF = process.argv[7];
var dNormal = process.argv[8];
var dStem = process.argv[9];

//Buat inverted file dokumen
var docFile = new invertedFile();
docFile.create(docURL, stopwordFile, dTF, dIDF, dNormal, dStem);
    
//Ngitung bobot kata tiap query
var qFile = new queryFile(docFile.idf);
qFile.create(queryURL, stopwordFile, dTF, dIDF, dNormal, dStem);

function get_qRels(file) {
	var temp = {};
	
	fs.readFileSync(file).toString().split('\n').forEach(function (line) {
		if(line.length > 0){
			var ltemp = line.split('   ');
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

var query_rank = {data : []};

function count_precision(q_no, dFound){
	var nr_found = 0, n_found = 0;
	// var qn = q_no.toString();
	// for(d in dFound){
	// 	if(typeof qn[d.toString()] === 'undefined')
	// 		nr_found++;
	// 	n_found++;
	// }
	if(n_found == 0)
		return 0;
	else
		return nr_found/n_found;
}

function count_recall(q_no, dFound){
	var nr_found = 0;
	var qn = q_no.toString();
	var nr_total = 0;
	// for(d in dFound){
	// 	if(typeof qn[d.toString()] === 'undefined')
	// 		nr_found++;
	// }
	// for(a in qRels[qn])
	// 	nr_total++;
	if(nr_total == 0)
		return 0;
	else
		return nr_found/nr_total;
}

function count_niap(q_no, dFound){
	var nr_ = 0, nr_found = 0, n_found = 0;
	var qn = q_no.toString();
	// for(d in dFound){
	// 	n_found++;
	// 	if(typeof qn[d.toString()] === 'undefined'){
	// 		nr_found++;
	// 		nr_ += nr_found/n_found;
	// 	}
	// }
	if(nr_found == 0)
		return 0;
	else
		return nr_/nr_found;
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
		if(sim != 0){
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
	query_rank['data'].push({query: qFile.file[iQuery].contents, rank: rank, 
		precision: count_precision(iQuery, rank), recall: count_recall(iQuery, rank), niap: count_niap(iQuery, rank)});

}

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