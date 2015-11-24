<?php
$abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

$reljuds = '';

if(!empty($_POST['reljud'])){
	foreach($_POST['reljud'] as $reljud){
		echo $reljud.'<br>';
		$reljuds = $reljuds . '~' . $reljud;
	}
}

$command = '/usr/local/bin/node '.$abs_path.'js/main2.js ' . $_POST['documents'] . ' ' . $reljuds;
// exec($command);

?>