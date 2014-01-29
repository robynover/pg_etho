<div id="observer_form_container">
   <!--data-rel="back"-->
   <!--<a href="#" id="obs_form_back" class="ui-btn ui-icon-arrow-l ui-btn-icon-notext ui-corner-all" data-direction="reverse" >No text</a>-->

    <div id="activity_choice">
        <strong>Activity: </strong>{{activity_friendly_name}}<br/>
    </div>
    <form id="form1" method="post" >
        <input type="hidden" id="utc_time"  value="the time" />
        <input type="hidden" name="activity" id="activity_hidden" value="{{activity_name}}"/>
        <div class="ui-field-contain">

            <label for="obs_notes">Notes</label>
            <textarea cols="40" rows="8" name="obs_notes" id="obs_notes"></textarea>
        </div>

        <a href="#newlog" id="add_btn" class="ui-shadow ui-btn ui-corner-all ui-btn-inline ui-icon-plus ui-btn-icon-left ui-btn-b">Add</a>
    </form>
    <input id="sync_cloud" class="ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-cloud" type="button" value="Save to Remote" />
</div><!-- /observer_form_container -->
