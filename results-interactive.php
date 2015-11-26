<?php
$abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';
$algorithm = $_GET['algorithm'];
$usdc = $_GET['usdc'];
$topS = $_GET['topS'];
$qExp = $_GET['qExp'];
$topN = '-1';
if($algorithm == 'pseudo')
  $topN = $_GET['topN'];

$query_raw = $_GET['query'];
$query = str_replace(' ', '~', $query_raw);
$command = '/usr/local/bin/node '.$abs_path.'js/main2.js ' . $query . ' ' . $topS;
exec($command);

$string = file_get_contents("js/interactive_result.json");
$output = json_decode($string);
$sum = $output->sum;
$rank = $output->rank;
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
                Searching Results
              </div>
              <br>
              <?php
              $documents = '';
              foreach ($rank as $row) {
                $documents = $documents . '~' . $row[0];
              }
              echo'
              <div class="pa--heading2">Results of <i>'.$query_raw.'</i></div>
              <b>Found : '.$sum.'</b>
              <form action="results-feedback-interactive.php" method="post" class="form-horizontal pa__form">
              <input type="hidden" name="documents" value="'.$documents.'">
              <input type="hidden" name="algorithm" value="'.$algorithm.'">
              <input type="hidden" name="topS" value="'.$topS.'">
              <input type="hidden" name="topN" value="'.$topN.'">
              <input type="hidden" name="qExp" value="'.$qExp.'">
              <input type="hidden" name="usdc" value="'.$usdc.'">
              <input type="hidden" name="query" value="'.$query.'">
              <ol>';
              $i=0;
              foreach($rank as $row){
                if($algorithm == 'pseudo'){
                  $i++;
                  if($i<=$topN){
                    echo '
                    <li class="padding-li">
                      <input class="form-horizontal pa__form" type="checkbox" name="reljud[]" value='.$row[0].'  checked></input>&nbsp;&nbsp;&nbsp;'.$row[0].' - '.$row[1].'
                    </li>';
                  }
                  else{
                    echo '
                  <li class="padding-li">
                    <input class="form-horizontal pa__form" type="checkbox" name="reljud[]" value='.$row[0].' ></input>&nbsp;&nbsp;&nbsp;'.$row[0].' - '.$row[1].'
                  </li>';
                  }
                }
                else{
                  echo '
                  <li class="padding-li">
                    <input class="form-horizontal pa__form" type="checkbox" name="reljud[]" value='.$row[0].'></input>&nbsp;&nbsp;&nbsp;'.$row[0].' - '.$row[1].'
                  </li>';
                }
              }
              ?>
              </ol>
                <div class="form-group">
                  <div class="col-md-11 pa__btn-container-form">
                    <input type="submit" class="btn btn-tosca btn-margin-bottom" value="Searching"></input>
                  </div>
                </div>
              </form>
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