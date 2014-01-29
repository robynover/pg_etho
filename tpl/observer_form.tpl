<div id="observer_form_container" >
    <div id="activity_choice"></div>
    <form id="form1" method="post" >
        <input type="hidden" id="utc_time"  value="the time" />
        <input type="hidden" name="activity" id="activity_hidden" value="none"/>
        <div class="ui-field-contain">
            
            <label for="obs_notes">Notes</label>
            <textarea cols="40" rows="8" name="obs_notes" id="obs_notes"></textarea>
        </div>
        
        <a href="#newlog" id="add_btn" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-plus ui-btn-icon-left ui-btn-b" data-transition="pop" data-rel="dialog">Add</a>
        <input id="sync_cloud" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-cloud" type="button" value="Save to Remote" />
    </form>
</div><!-- /observer_form_container -->