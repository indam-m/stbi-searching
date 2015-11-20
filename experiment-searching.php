<form class="form-horizontal pa__form" action="results.php">
  <div class="form-group">
    <label class="col-md-4 control-label">Document Location</label>
    <div class="col-md-7">
      <input class="form-control" type="text" id="document" name="document">
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Query Location</label>
    <div class="col-md-7">
      <input class="form-control" type="text" id="query" name="query">
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Relevance Judgement</label>
    <div class="col-md-7">
      <input class="form-control" type="text" id="relevance" name="relevance">
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Stopword Location</label>
    <div class="col-md-7">
      <input class="form-control" type="text" id="stopword" name="stopword">
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Algorithm</label>
    <div class="col-md-7">
      <select id="algorithm" class="form-control" onChange="load_topN();">
        <option value="rocchio">Rocchio</option>
        <option value="idereg">Ide Regular</option>
        <option value="idedechi">Ide dec Hi</option>
        <option value="pseudo">Pseudo Relevance Feedback</option>
      </select>
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Use Same Document Collection</label>
    <div class="col-md-7">
      <div style= "padding-top: 8px;">
        <label class="col-md-3">
          <input type="radio" id="usdc" name="usdc" value="true" checked> Yes
        </label>
        <label class="col-md-3">
          <input type="radio" id="usdc" name="usdc" value="false" checked> No
        </label>
      </div>
    </div>
  </div>
  <div class="form-group">
    <label class="col-md-4 control-label">Top S</label>
    <div class="col-md-3">
      <input class="form-control" type="number" id="topS" name="topS">
    </div>
  </div>
  <div id="topN"></div>
  <div class="form-group">
    <label class="col-md-4 control-label">Query Expansion</label>
    <div class="col-md-7">
      <div style= "padding-top: 8px;">
        <label class="col-md-3">
          <input type="radio" id="qExp" name="qExp" value="true" checked> Yes
        </label>
        <label class="col-md-3">
          <input type="radio" id="qExp" name="qExp" value="false" checked> No
        </label>
      </div>
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
              <input type="radio" id="docTF" name="docTF" value="binary" checked>
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
              Using IDF
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
              <input type="radio" id="queryTF" name="queryTF" value="binary" checked>
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
              Using IDF
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
      <input type="submit" class="btn btn-tosca btn-margin-bottom" value="Searching"></input>
    </div>
  </div>
</form>

<script>
function load_topN(){
  var e = document.getElementById('algorithm');
  if(e.options[e.selectedIndex].value == 'pseudo'){
    $.get('topN.php').then(function(responseData) {
      $('#topN').html(responseData);
    });
  }
  else{
    document.getElementById('topN').innerHTML = '';
  }
}

</script>