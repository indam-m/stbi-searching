function RelevanceFeedback(invertedFile, query, relevantDocs, irrelevantDocs, algorithm, expand){
	var abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';
	
	this.invertedFile = invertedFile;
	this.relevantDocs = relevantDocs;
	this.irrelevantDocs = irrelevantDocs;
	this.algorithm = algorithm;
	this.expand = expand;

	this.query = query;
	this.words = [];
	if(this.expand){
		this.getDistinctWords();
	}
	else{
		for(i in this.query.data){
			this.words.push(this.query.data[i].word);	
		}
	}
	this.updateWeight();
	return this.query;
};

RelevanceFeedback.prototype.updateWeight = function() {
	this.newWeight = this.countUpdate();
	temp = [];
	for(i in this.newWeight){
		for(j in this.query.data){
			if(this.newWeight[i].word == this.query.data[j].word){
				this.query.data[j].weight += this.newWeight[i].weight;
				if(this.query.data[j].weight <=0){
					this.query.data[j].weight = 0;
				}
			}
			else if(this.expand && this.newWeight[i].weight>0){
				if(temp.indexOf(this.newWeight[i]) == -1){
					temp.push(this.newWeight[i]);
				}
			}
		}
	}

	for(i in temp){
		this.query.data.push(temp[i]);
	}
}


RelevanceFeedback.prototype.countUpdate = function(){
	var data = [];
	relevant = [this.relevantDocs, this.irrelevantDocs];
	for (i in this.words){
		var updateWord = {}
		for(z in relevant){
			var temp = {
				weight: 0,
				counter: 0
			}
			for (j in relevant[z]){
				for (k in this.invertedFile){
					if(this.invertedFile[k].doc_number == relevant[z][j]){
						for(l in this.invertedFile[k].data){
							if(this.invertedFile[k].data[l].word === this.words[i]){
								if(this.algorithm === 'dechi'){
									if(z == 0){
										temp.weight += this.invertedFile[k].data[l].weight;
										temp.counter += 1;
									}
									else{
										if(temp.counter == 0){
											temp.weight = this.invertedFile[k].data[l].weight;
											temp.counter += 1;	
										}
									}
								}
								else{
									temp.weight += this.invertedFile[k].data[l].weight;
									temp.counter += 1;
								}	
							}
						}
					}
				}
			}
			if(temp.counter != 0){
				var val = 0;
				if(z == 0){
					if(this.algorithm === 'rocchio'){
						val = temp.weight/temp.counter;
					}
					else {
						val = temp.weight;
					}
					updateWord.relevant = val;
				}
				else{
					if(this.algorithm === 'rocchio'){
						val = temp.weight/temp.counter;
					}
					else {
						val = temp.weight;
					}
					updateWord.irrelevant = val;
				}
			}
		}
		if(updateWord.relevant || updateWord.irrelevant){
			var anotherTemp = {};
			anotherTemp.word = this.words[i];
			anotherTemp.weight = 0;
			if(updateWord.relevant){
				anotherTemp.weight += updateWord.relevant;
			}
			if(updateWord.irrelevant){
				anotherTemp.weight -= updateWord.irrelevant;
			}
			data.push(anotherTemp);
		}
	}
	return data;
}

RelevanceFeedback.prototype.getDistinctWords = function(){
	for(i in this.invertedFile){
		var data = this.invertedFile[i].data;
		for(j in data){
			if(this.words.indexOf(data[j].word) == -1){
				this.words.push(data[j].word);
			}
		}
	}
	for(i in this.query.data){
		if(this.words.indexOf(this.query.data[i].word) == -1){
			this.words.push(this.query.data[i].word);	
		}
	}
}

module.exports = RelevanceFeedback;

