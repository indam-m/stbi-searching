<?php

if(!empty($_POST['reljud'])){
	foreach($_POST['reljud'] as $reljud){
		echo $reljud.'<br>';
	}
}

?>