<form class="form-horizontal pa__form" action="results-interactive.php">
  <div class="form-group">
    <label class="col-md-4 control-label">Query</label>
    <div class="col-md-7">
      <input class="form-control" type="text" id="query" name="query"></input>
    </div>
  </div>
	<div class="form-group">
    <label class="col-md-4 control-label">Algorithm</label>
    <div class="col-md-7">
      <select id="algorithm" class="form-control" onChange="load_topN();">
        <option value="rocchio">Rocchio</option>
        <option value="regular">Ide Regular</option>
        <option value="dechi">Ide dec Hi</option>
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
