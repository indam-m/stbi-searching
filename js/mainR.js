var Relevance = require('./MainRelevance');

var relevantDocs = [55,64,71,12];
var irrelevantDocs = [61,1,41,7];
var algorithm = 'rocchio'; //rocchio/regular/dechi
var usdc = true; //true/false
var topS = 10;
var expand = true; //true/false

var main = new Relevance(relevantDocs, irrelevantDocs, algorithm, usdc, topS, expand);