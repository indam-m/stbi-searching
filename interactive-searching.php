<form class="form-horizontal pa__form" action="results-interactive.php">
	<div class="form-group">
    <label class="col-md-4 control-label">Algorithm</label>
    <div class="col-md-7">
      <select id="algorithm" class="form-control">
        <option value="rocchio">Rocchio</option>
        <option value="regular">Ide Regular</option>
        <option value="dechi">Ide dec Hi</option>
        <option value="pseudo">Pseudo Relevance Feedback</option>
      </select>
    </div>
  </div>
	<div class="form-group">
	  <label class="col-md-4 control-label">Query</label>
	  <div class="col-md-7">
	    <input class="form-control" type="text" id="query" name="query"></input>
	    <br>
	    <input class="btn btn-tosca btn-margin-bottom" type="submit" value="search"></input>
	  </div>
	</div>
</form>
