<?php
$abs_path = '/Applications/XAMPP/xamppfiles/htdocs/stbi01/';

$document = str_replace('%2F', '/', $_GET['document']);
$query = str_replace('%2F', '/', $_GET['query']);;
$relevance = str_replace('%2F', '/', $_GET['relevance']);;
$stopword = str_replace('%2F', '/', $_GET['stopword']);;

$docTF = $_GET['docTF'];
$docIDF = $_GET['docIDF'];
$docNormalisation = $_GET['docNormalisation'];
$docStemming = $_GET['docStemming'];
$queryTF = $_GET['queryTF'];
$queryIDF = $_GET['queryIDF'];
$queryNormalisation = $_GET['queryNormalisation'];
$queryStemming = $_GET['queryStemming'];
$algo = $_GET['algorithm'];
$usdc = $_GET['usdc'];
$topS = $_GET['topS'];
$qExp =$_GET['qExp'];

$docsetting = $docTF . ' ' . $docIDF . ' ' . $docNormalisation . ' ' . $docStemming;
$querysetting = $queryTF . ' ' . $queryIDF . ' ' . $queryNormalisation . ' ' . $queryStemming;

$command = '/usr/local/bin/node '.$abs_path.'js/main.js '.$document.' '.$query.' '.$relevance.' '.$stopword.' '.$docsetting.' '.$querysetting.' '.$algo.' '.$usdc.' '.$topS.' '.$qExp;

if($algo == 'pseudo')
  $command = $command.' '.$_GET['topN'];

exec($command);

$string = file_get_contents("js/test3.json");
$output = json_decode($string);
$results = $output->data;
$averages = $output->averages;

$_old_queries = file_get_contents("js/queryWeight.json");
$_new_queries = file_get_contents("js/newQueryWeight.json");

$old_queries = json_decode($_old_queries);
$new_queries = json_decode($_new_queries);

$secondR = json_decode(file_get_contents("js/2ndRetreive.json"));
$post_averages = $secondR->averages;

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
              <div class="result">
                <div class="pa--heading">
                  Averages
                </div>
                <b>Before</b>
                <div class="row">
                  <div class="col-md-5"><b>Precision</b></div>
                  <div class="col-md-5"><?php echo $averages->precision; ?></div>
                </div>
                <div class="row">
                  <div class="col-md-5"><b>Recall</b></div>
                  <div class="col-md-5"><?php echo $averages->recall; ?></div>
                </div>
                <div class="row">
                  <div class="col-md-5"><b>Non-Interpolated Average Precision</b></div>
                  <div class="col-md-5"><?php echo $averages->niap; ?></div>
                </div><br>

                <b>After</b>
                <div class="row">
                  <div class="col-md-5"><b>Precision</b></div>
                  <div class="col-md-5"><?php echo $post_averages->precision; ?></div>
                </div>
                <div class="row">
                  <div class="col-md-5"><b>Recall</b></div>
                  <div class="col-md-5"><?php echo $post_averages->recall; ?></div>
                </div>
                <div class="row">
                  <div class="col-md-5"><b>Non-Interpolated Average Precision</b></div>
                  <div class="col-md-5"><?php echo $post_averages->niap; ?></div>
                </div>
              </div>

              <div class="pa--heading">
                Searching Results
              </div>
              <ol>
                <?php
                foreach($results as $res){
                  echo'
                  <li class="result"><b>Query : </b><i>'.$res->query.'</i>
                  <div class="form-horizontal pa__form">
                    <div class="row">
                      <div class="col-md-6">
                        <b> Old Query </b>
                        <table class="table table-striped form-horizontal pa__form">
                          <tr>
                            <th>Word(s)</th>
                            <th>Weight</th>
                          </tr>';
                          $number = (int) $res->number;
                          $old_query = $old_queries[$number-1];
                          foreach($old_query->data as $row){
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
                          $number = (int) $res->number;
                          $new_query = $new_queries[$number-1];
                          foreach($new_query->data as $row){
                            echo'
                            <tr>
                              <td>'.$row->word.'</td><td>'.$row->weight.'</td>
                            </tr>';
                          }
                      echo'
                          </table>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-3"><b>Old Documents</b></div>
                        <div class="col-md-3">
                          <ol>';
                            foreach($res->rank as $row){
                              echo '<li>'.$row.'</li>';
                            }                          
                          echo '</ol>
                        </div>
                        <div class="col-md-3"><b>New Documents</b></div>
                        <div class="col-md-3">
                          <ol>';
                            foreach($secondR->data[$number-1]->rank as $row){
                              echo '<li>'.$row.'</li>';
                            }                          
                          echo '</ol>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-3"><b>Old Precision</b></div>
                        <div class="col-md-3">'.$res->precision.'</div>
                        <div class="col-md-3"><b>New Precision</b></div>
                        <div class="col-md-3">'.$secondR->data[$number-1]->precision.'</div>
                      </div>
                      <div class="row">
                        <div class="col-md-3"><b>Old Recall</b></div>
                        <div class="col-md-3">'.$res->recall.'</div>
                        <div class="col-md-3"><b>New Recall</b></div>
                        <div class="col-md-3">'.$secondR->data[$number-1]->recall.'</div>
                      </div>
                      <div class="row">
                        <div class="col-md-3"><b>Old NIAP</b></div>
                        <div class="col-md-3">'.$res->niap.'</div>
                        <div class="col-md-3"><b>New NIAP</b></div>
                        <div class="col-md-3">'.$secondR->data[$number-1]->niap.'</div>
                      </div>
                    </div>
                  </li><br>';
                }
                ?>
              </ol>
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