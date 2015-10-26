var stopword = require("keyword-extractor");
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
};

InvertedFile.prototype.readFile = function(file) {
	var temp = [];
	var reading = '';
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

InvertedFile.prototype.create = function(){
	for(i in this.documents){
		var datatemp = [];
		var stemWords = [];

		//Removing stopwords
		words = this.removeStopwords(this.documents[i].content);
		for(j in words){
			stemWords.push(stemming(words[j]));
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
					instancetemp.raw_tf = wordCount;
					instancetemp.log_tf = 1 + Math.log2(wordCount);
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
		for(j in datatemp){
			datatemp[j].aug_tf = 0.5 + (0.5 * datatemp[j].raw_tf / maxTf);
		}

		var doc = {
			doc_number: this.documents[i].no,
			data: datatemp
		}
		this.file.push(doc);
	}
};

InvertedFile.prototype.removeStopwords = function(sentence){
	return stopword.extract(sentence,{
	    language:"english",
	    remove_digits: false,
	    return_changed_case:true,
	    remove_duplicates: false
	});
}

module.exports = InvertedFile;