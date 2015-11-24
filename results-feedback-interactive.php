<?php
$abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

$query = $_POST['query'];
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
		$reljuds = $reljuds . '~' . $reljud;
	}
}

$command = '/usr/local/bin/node '.$abs_path.'js/mainR.js '.$documents.' '.$reljuds.' '.$algorithm.' '.$usdc.' '.$topS.' '.$qExp.' '.$topN.' '.$query;
exec($command);

$string = file_get_contents("js/new_interactive_result.json");
$output = json_decode($string);
$sum = $output->sum;
$rank = $output->rank;
$query = $output->query;

$_old_queries = file_get_contents("js/queryWeight.json");
$_new_queries = file_get_contents("js/newQueryWeight.json");

$old_queries = json_decode($_old_queries);
$new_queries = json_decode($_new_queries);

?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/main.css">
    <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
  </head>
  <body class="sticky-display">
    <div id="lightbox-shadow"></div>
    <!--[if lt IE 7]>
    <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <div id="container-s">
      <header class="header-s">
        <div id="header-s__toggle">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div id="header-s__title">
          Searching with Inverted File
        </div>
      </header>

      <nav class="sidebar-s">
        <ul class="sidebar-s--divider">
          <li><a href="index.php">
            <i class="fa fa-home sidebar-s--icon-p"></i>
            Main Page
          </a></li>
          <li><a href="indexing.php">
            <i class="fa fa-leaf sidebar-s--icon-p"></i>
            Indexing
          </a></li>
          <li><a href="searching.php">
            <i class="fa fa-search sidebar-s--icon-p"></i>
            Searching
          </a></li>
        </ul>
      </nav>

      <div class="layer-hidden"></div>
      <div id="content-s" class="pa__padding">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-7 grid-center pa__box">
              <div class="pa--heading">
                Searching Results <?php echo $command; ?>
              </div>
              <br>
              <?php
              // $documents = '';
              // foreach ($rank as $row) {
              //   $documents = $documents . '~' . $row[0];
              // }
              echo'
              <div class="pa--heading2">Results of <i>'.$query.'</i></div>
              <div class="row">
              <div class="col-md-6">
                <b> Old Query </b>
                <table class="table table-striped form-horizontal pa__form">
                  <tr>
                    <th>Word(s)</th>
                    <th>Weight</th>
                  </tr>';
                  foreach($old_queries[0]->data as $row){
                    echo'
                    <tr>
                      <td>'.$row->word.'</td><td>'.$row->weight.'</td>
                    </tr>';
                  }
                  echo'
                </table>
              </div>
              <div class="col-md-6">
                <b> New Query </b>
                <table class="table table-striped form-horizontal pa__form">
                  <tr>
                    <th>Word(s)</th>
                    <th>Weight</th>
                  </tr>';
                  foreach($new_queries[0]->data as $row){
                    echo'
                    <tr>
                      <td>'.$row->word.'</td><td>'.$row->weight.'</td>
                    </tr>';
                  }
              echo'
                  </table>
                </div>
              </div>
              <b>Found : '.$sum.'</b>
              <ol>';
              foreach($rank as $row){
              	echo '
                  <li class="padding-li">'.$row[0].' - '.$row[1].'</li>';
              }
              ?>
              </ol>
            </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer-s">
        <div class="footer-s__container">
          <div class="footer-s--right">
            13512020 - Gifari Kautsar • 
            13512026 - Indam Muhammad <br>
            13512072 - Kanya Paramita • 
            13512087 - M Lutfi Fadlan
          </div>
        </div>
      </footer>
    </div>

    <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"><\/script>')</script>
    <script src="js/vendor/jquery-1.11.1.min.js"></script>
    <script src="js/vendor/jquery-ui.min.js"></script>
    <script src="js/vendor/bootstrap.min.js"></script>
    <script src="js/miscellaneous.js"></script>
  </body>
</html>