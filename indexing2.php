<?php

$document = str_replace('%2F', '/', $_GET['document']);
$query = str_replace('%2F', '/', $_GET['query']);
$relevance = str_replace('%2F', '/', $_GET['relevance']);
$stopword = str_replace('%2F', '/', $_GET['stopword']);

$document = $_POST['document'];
$query = $_POST['query'];
$relevance = $_POST['relevance'];
$stopword = $_POST['stopword'];
$docTF = $_POST['docTF'];
$docIDF = $_POST['docIDF'];
$docNormalisation = $_POST['docNormalisation'];
$docStemming = $_POST['docStemming'];
$queryTF = $_POST['queryTF'];
$queryIDF = $_POST['queryIDF'];
$queryNormalisation = $_POST['queryNormalisation'];
$queryStemming = $_POST['queryStemming'];

$string = file_get_contents("js/test3.json");
$output = json_decode($string);
$results = $output->data;

$docsetting = $docTF . ' ' . $docIDF . ' ' . $docNormalisation . ' ' . $docStemming;
$querysetting = $queryTF . ' ' . $queryIDF . ' ' . $queryNormalisation . ' ' . $queryStemming;

$command = '/usr/local/bin/node '.$abs_path.'js/main.js '.$document.' '.$query.' '.$relevance.' '.$stopword.' '.$docsetting.' '.$querysetting;
exec($command);

header('Location: '.'index.php');

?>