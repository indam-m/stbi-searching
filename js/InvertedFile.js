var stemming = require('stem-porter');
var fs  = require("fs");

function InvertedFile(){
	/*
		this.documents = [
			{no: 1, title: '', author: [], content: ''}, 
			..., 
			{no: n, title: '', author: [], content: ''}
		];
	*/
	this.documents = [];
	/*
		this.file = [
			{doc_number: 1, data: [{word: '', raw_tf: 0}]}, 
			..., 
			{doc_number: n, data: [{word: '', raw_tf: 1}]},
		];
	*/
	this.file = [];
	/*
		this.stopwords = [w1, w2, ..., wn]
	*/
	this.stopwords = [];
	/*
		this.idf={
			words: [w1, w2, ..., wn],
			value: [idf1, idf2, ..., idfn]
		}
	*/
	this.idf = {};
};

InvertedFile.prototype.readDoc = function(file) {
	var temp = [];
	var reading = 'I';
	var data = {
		no: 0,
		title: '',
		author: [],
		content: ''
	};
	
	fs.readFileSync(file).toString().split('\n').forEach(function (line) { 
		if(line.indexOf('.I') === 0){
			if(data.content != ''){
				temp.push(data);
			}
			data = {
				no: line.slice(3),
				title: '',
				author: [],
				content: ''
			};
			reading = 'I';
		}
		else if(line.indexOf('.T') === 0){
			reading = 'T';
		}
		else if(line.indexOf('.A') === 0){
			reading = 'A';
		}
		else if(line.indexOf('.W') === 0){
			reading = 'W';
		}
		else if(line.indexOf('.X') === 0){
			reading = 'X';
		}

		if(reading === 'T' && line.indexOf('.T') !== 0){
			data.title += line + ' ';
		}
		else if(reading === 'A' && line.indexOf('.A') !== 0){
			data.author.push(line);
		}
		else if(reading === 'W' && line.indexOf('.W') !== 0){
			data.content += line + ' ';
		}
	});
	temp.push(data);
	this.documents = temp;
};

InvertedFile.prototype.readStopWord = function(file) {
	var temp = [];
	fs.readFileSync(file).toString().split('\r\n').forEach(function (line) { 
		temp.push(line);
	});

	this.stopwords = temp;
};

InvertedFile.prototype.calculateIdf = function(){
	var words = [];
	var counter = [];
	var value = [];
	for(i in this.file){
		var added = false;
		var tempdata = this.file[i].data;
		for (j in tempdata){
			if(words.indexOf(tempdata[j].word) === -1){
				words.push(tempdata[j].word);
				counter.push(1);
				added = true;
			}
			else{
				if(!added){
					counter[words.indexOf(tempdata[j].word)]++;
					added = true;
				}
			}
		}
	}
	
	for(i in words){
		value.push(Math.log(this.documents.length/counter[i]));
	}

	this.idf = {
		words: words,
		value: value
	} 
};

InvertedFile.prototype.create = function(docFile, stopwordFile, dTF, dIDF, dNormal, dStem){
	//read document file
	this.readDoc(docFile);
	this.readStopWord(stopwordFile);

	for(i in this.documents){
		var datatemp = [];
		var stemWords = [];

		//Removing stopwords
		words = this.removeStopwords(this.documents[i].content);
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
			doc_number: this.documents[i].no,
			title: this.documents[i].title,
			data: datatemp
		}
		this.file.push(doc);
	}
	this.calculateIdf();
	if(dIDF){
		this.updateWeight();
	}

	if(dNormal){
		this.updateNormal();
	}
};

InvertedFile.prototype.updateNormal = function(){
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

InvertedFile.prototype.updateWeight = function(){
	for(i in this.file){
		var data = this.file[i].data;
		for(j in data){
			var idf = this.idf.value[this.idf.words.indexOf(data[j].word)]
			data[j].weight *= idf;
		}
	}
}

InvertedFile.prototype.removeStopwords = function(sentence){
	var temp = [];
	var stop = this.stopwords;
	sentence.split(" ").forEach(function (word) { 
		word = word.toLowerCase();
		word = word.replace(/[^a-zA-Z0-9 ]/g, "")
		
		if(stop.indexOf(word) == -1 && word != ''){
			temp.push(word);
		}
	});
	return temp;
};

module.exports = InvertedFile;