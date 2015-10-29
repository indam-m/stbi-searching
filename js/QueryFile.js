var stemming = require('stem-porter');
var fs  = require("fs");

function QueryFile(idf){
	this.queries = [];
	this.file = [];
	this.idf = idf;
};

QueryFile.prototype.readQuery = function(file) {
	var temp = [];
	var reading = 'I';
	var data = {
		no: 0,
		content: '',
		contents: ''
	};
	
	fs.readFileSync(file).toString().split('\n').forEach(function (line) { 
		if(line.indexOf('.I') === 0){
			if(data.content != ''){
				temp.push(data);
			}
			data = {
				no: line.slice(3),
				content: '',
				contents: ''
			};
			reading = 'I';
		}
		else if(line.indexOf('.W') === 0){
			reading = 'W';
		}

		if(reading === 'W' && line.indexOf('.W') !== 0){
			data.content += line + ' ';
			data.contents += line + ' ';
		}
	});
	temp.push(data);
	this.queries = temp;
};

QueryFile.prototype.readStopWord = function(file) {
	var temp = [];
	fs.readFileSync(file).toString().split('\r\n').forEach(function (line) { 
		temp.push(line);
	});

	this.stopwords = temp;
};


QueryFile.prototype.create = function(queryFile, stopwordFile, dTF, dIDF, dNormal, dStem){
	//read document file
	this.readQuery(queryFile);
	this.readStopWord(stopwordFile);

	for(i in this.queries){
		var datatemp = [];
		var stemWords = [];

		//Removing stopwords
		words = this.removeStopwords(this.queries[i].content);
		if(dStem){
			for(j in words){
				stemWords.push(stemming(words[j]));
			}
		}
		else{
			stemWords = words;
		}
		

		//Calculating Term Frequency
		var temp = '';
		var wordCount = 0;
		var maxTf = 0;
		stemWords.sort();
		for(j in stemWords){
			if(temp === stemWords[j]){
				wordCount += 1;
			}
			else{
				if(j>0){
					if(wordCount > maxTf){
						maxTf = wordCount;
					}

					var instancetemp = {};
					instancetemp.word = temp;
					if(dTF === 'raw' || dTF === 'aug'){
						instancetemp.weight = wordCount;
					}
					else if(dTF === 'log'){
						instancetemp.weight =  1 + Math.log(wordCount);
					}
					else if(dTF === 'binary'){
						instancetemp.weight = 1;
					}
					datatemp.push(instancetemp);
				}
				temp = stemWords[j];
				wordCount = 1;
			}

			//Last element
			if(j === stemWords.length-1){
				if(wordCount > maxTf){
					maxTf = wordCount;
				}

				var instancetemp = {};
				instancetemp.word = temp;
				instancetemp.raw_tf = wordCount;
				instancetemp.log_tf = 1 + Math.log2(wordCount);
				datatemp.push(instancetemp);
			}
		}

		//Calculating Augmented TF after max_tf is calculated
		if(dTF === 'aug'){
			for(j in datatemp){
				datatemp[j].weight = 0.5 + (0.5 * datatemp[j].weight / maxTf);
			}	
		}

		var doc = {
			query_number: this.queries[i].no,
			data: datatemp,
			contents: this.queries[i].contents
		}
		this.file.push(doc);
	}

	if(dIDF){
		this.updateWeight();
	}

	if(dNormal){
		this.updateNormal();
	}
};

QueryFile.prototype.updateNormal = function(){
	for(i in this.file){
		var data = this.file[i].data;
		//calculate length
		var length = 0;
		for(j in data){
			length += (data[j].weight * data[j].weight);
		}
		length = Math.sqrt(length);
		//update weight
		for(j in data){
			data[j].weight /= length;
		}
	}
}

QueryFile.prototype.updateWeight = function(){
	for(i in this.file){
		var data = this.file[i].data;
		for(j in data){
			if(this.idf.words.indexOf(data[j].word) == -1){
				data[j].weight = 0;	
			}
			else{
				var idf = this.idf.value[this.idf.words.indexOf(data[j].word)]
				data[j].weight *= idf;
			}
		}
	}
}

QueryFile.prototype.removeStopwords = function(sentence){
	var temp = [];
	var stop = this.stopwords;
	sentence.split(" ").forEach(function (word) { 
		word = word.replace('-', '~','!','@','#','$','%','^','&','*','(',')','_','+','`','{','}','|','[',']','\\',':','"',';','\'','<','>','?',',','/','.',' ');
		word = word.toLowerCase();
		if(stop.indexOf(word) == -1 && word != ''){
			temp.push(word);
		}
	});
	return temp;
};

module.exports = QueryFile;