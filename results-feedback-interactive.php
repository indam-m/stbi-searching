<?php
$abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

$reljuds = '';
$documents = $_POST['documents'];
$algorithm = $_POST['algorithm'];
$usdc = $_POST['usdc'];
$topS = $_POST['topS'];
$qExp = $_POST['qExp'];
$topN = '-1';
if($algorithm == 'pseudo')
  $topN = $_POST['topN'];

if(!empty($_POST['reljud'])){
	foreach($_POST['reljud'] as $reljud){
		echo $reljud.'<br>';
		$reljuds = $reljuds . '~' . $reljud;
	}
}

$command = '/usr/local/bin/node '.$abs_path.'js/main2.js '.$_POST['documents'].' '.$reljuds.' '.$documents.' '.$algorithm.' '.$usdc.' '.$topS.' '.$qExp.' '.$topN;
exec($command);

?>