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
                Indexing
              </div>
              <form class="form-horizontal pa__form" action="indexing2.php" method="post">
                <div class="form-group">
                  <label class="col-md-4 control-label">Document Location</label>
                  <div class="col-md-7">
                    <input type="text" id="document" name="document">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label">Query Location</label>
                  <div class="col-md-7">
                    <input type="text" id="query" name="query">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label">Relevance Judgement</label>
                  <div class="col-md-7">
                    <input type="text" id="relevance" name="relevance">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label">Stopword Location</label>
                  <div class="col-md-7">
                    <input type="text" id="stopword" name="stopword">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <br><center><label class="control-label">Document Settings</label></center>
                    <div class="form-group">
                      <br><label class="col-md-5 control-label">TF</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="docTF" name="docTF" value="no" checked>
                            No TF
                          </label><br>
                          <label>
                            <input type="radio" id="docTF" name="docTF" value="raw">
                            Raw TF
                          </label><br>
                          <label>
                            <input type="radio" id="docTF" name="docTF" value="binary">
                            Binary TF
                          </label><br>
                          <label>
                            <input type="radio" id="docTF" name="docTF" value="aug">
                            Augmented TF
                          </label><br>
                          <label>
                            <input type="radio" id="docTF" name="docTF" value="log">
                            Logarithmic TF
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">IDF</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="docIDF" name="docIDF" value="false" checked>
                            No IDF
                          </label><br>
                          <label>
                            <input type="radio" id="docIDF" name="docIDF" value="true">
                            Using TF
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">Normalisation</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="docNormalisation" name="docNormalisation" value="false" checked>
                            No Normalisation
                          </label><br>
                          <label>
                            <input type="radio" id="docNormalisation" name="docNormalisation" value="true">
                            Using Normalisation
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">Stemming</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="docStemming" name="docStemming" value="false" checked>
                            No Stemming
                          </label><br>
                          <label>
                            <input type="radio" id="docStemming" name="docStemming" value="true">
                            Using Stemming
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <br><center><label class="control-label">Query Settings</label></center>
                    <div class="form-group">
                      <br><label class="col-md-5 control-label">TF</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="queryTF" name="queryTF" value="no" checked>
                            No TF
                          </label><br>
                          <label>
                            <input type="radio" id="queryTF" name="queryTF" value="raw">
                            Raw TF
                          </label><br>
                          <label>
                            <input type="radio" id="queryTF" name="queryTF" value="binary">
                            Binary TF
                          </label><br>
                          <label>
                            <input type="radio" id="queryTF" name="queryTF" value="aug">
                            Augmented TF
                          </label><br>
                          <label>
                            <input type="radio" id="queryTF" name="queryTF" value="log">
                            Logarithmic TF
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">IDF</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="queryIDF" name="queryIDF" value="false" checked>
                            No IDF
                          </label><br>
                          <label>
                            <input type="radio" id="queryIDF" name="queryIDF" value="true">
                            Using TF
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">Normalisation</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="queryNormalisation" name="queryNormalisation" value="false" checked>
                            No Normalisation
                          </label><br>
                          <label>
                            <input type="radio" id="queryNormalisation" name="queryNormalisation" value="true">
                            Using Normalisation
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-md-5 control-label">Stemming</label>  
                      <div class="col-md-7">
                        <div class="radio">
                          <label>
                            <input type="radio" id="queryStemming" name="queryStemming" value="false" checked>
                            No Stemming
                          </label><br>
                          <label>
                            <input type="radio" id="queryStemming" name="queryStemming" value="true">
                            Using Stemming
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="col-md-11 pa__btn-container-form">
                    <input type="submit" class="btn btn-tosca btn-margin-bottom" value="Indexing"></input>
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