//BROWSER_DEV = true; //quick switching for development in browser
var app = {
    // Application Constructor
    initialize: function() {
        //console.log('init');
        this.bindEvents(); // bind events
    },
    bindEvents: function() {
        // the equiv of documentready in jquery. wait for load before proceeding
        //if (BROWSER_DEV){
        if (navigator.userAgent.match(/(Mozilla)/)){ //in browser, we'll assume (for debugging)
            $(document).ready(this.onDeviceReady());   
            //test connectivity
            //$.ajax("https://ethoinfo.cloudant.com/_all_dbs").done(function(resp) { console.log(resp); });
            //$.ajax({url:"https://ethoinfo.cloudant.com/_all_dbs", xhrFields:{withCredentials:true}}).done(function(resp) { console.log(resp); });
           // alert(navigator.userAgent);        
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        
        
        
    },
    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },
    onDeviceReady: function(){
        
        // make standard headers on page elements
        app.setUpPageHeaders();

        // load templates
        //app.loadExternalTemplate('activity_menu','logs_content',function(){
            //console.log('loadExternalTemplate');
            //alert('external tpl load');
            //pgDebugLog('loadExternalTemplate');
            $('ul.activity_list li a').click(function(){
                console.log('click li a');
                pgDebugLog('click li a');
                
                activity_friendly_name = $(this).html();
                activity_name = $(this).attr('name');
                app.loadExternalTemplate('observer_form','obs_form_content',function(){
                    //TODO should be dynamic to form or id name
                    $('#activity_hidden').val(activity_name);
                    act_pre = '<strong>Activity:</strong> ';
                    act_post = '<br/><a href="#" class="ui-btn ui-icon-arrow-l ui-btn-icon-notext ui-corner-all">No text</a>';

                    $('#activity_choice').html(act_pre + activity_friendly_name + act_post);
                    //TODO break out form listeners into their own func/s
                    $( "#add_btn" ).on("click touchstart",function() {
                        app.onSubmit();
                        return false;
                     });

                    $( "#form1" ).submit(function() {
                        //app.onSubmit();
                        return false;
                     });
                });
    
        });

        //});

        
        
        //sync button
        $('#sync_cloud').on("click touchstart",function(){
            console.log('sync fired');
            //('sync fired');
            pouchSync.sync(TO_CLOUD);

        });


    },
    onSubmit: function(){
        app.setInputTime($('#utc_time'));
        if ($('#obs_notes').val().trim().length > 0){
            app.storeInput($('#utc_time').val(),$('#obs_notes').val().trim(),$('#activity_hidden').val());
            // clear out the field for the next input
            $('#obs_notes').val('');
        } else {
            alert("Please enter a record");
        }
        return false;
    },
    setInputTime: function(el){
        if(el){
            utc = Date.now(); //current time
            el.val(utc); 
        }
        
    },
    storeInput:function(dt,oname,activity){
        // TODO: add activity data
        // using pouchDB
        newrecord = {'date':dt,'obs_notes':oname,'activity':activity};
        pouchSync.add(newrecord);
        pouchSync.sync(TO_CLOUD);
        //append to <ul> list of records in real time
        //this.appendToRecordLi($( "#record_list" ),oname,dt);

    },
    showRecords: function(){

        pouchSync.all(function(results){
            //console.log(results);
            var template = Handlebars.compile($("#record-list-tpl").html());  
            $('#record_list').html(template(results)); //give it the data
        });
    },
    appendToRecordLi: function(ul_el,name,date){
        // make the data into an object, formatted the same as an obj with multiple records
        //   so it can use the same template
        single_record = [{doc:{'date':date,'obs_name':name}}]; 
        // have to compile again 
        var template = Handlebars.compile($("#record-list-tpl").html());  
        ul_el.append(template(single_record)); //give it the data

    }, 
    sendToServer: function(){
        /*
        Send all the stuff from local storage over to the server
        */
       
        $.ajax({
          type: "POST",
          url: "http://phonegap.local:8888/php/receive.php",
          data: {json: JSON.stringify(this.things)}
        })
        .done(function( msg ) {
            //alert('msg: '+ msg);
            //console.log('done');
            $('#debug pre').html(msg);
          });
    },
    setUpPageHeaders: function(){
        //only the header from the first page will contain the header content
        //the rest of the pages will copy it
        var theHeader = $('#constantheader-wrapper').html();
        var allHeaders = $('div[data-role="header"]');
        // starting with the SECOND one, index 1
        for (var i = 1; i < allHeaders.length; i++) {
            allHeaders[i].innerHTML = theHeader + allHeaders[i].innerHTML;
        }
        
    },
    
    loadExternalTemplate: function(path,el,callback) {
        console.log('tpl! ');
        //pgDebugLog('template load called');
        var base = window.location.pathname;
        var source;
        var template;
        var fullpath = base + "tpl/" + path + '.tpl';
        
        $.ajax({
            url: fullpath,
            success: function(data) {
                console.log('PATH ' + fullpath);
                source    = data;
                template  = Handlebars.compile(source);
                $('#' + el).html(template);
                //execute the callback if passed
                if (callback) callback(template);
            },
            error:function(x,y,z){
                console.log ('PATH ' + fullpath);
            }
        });
    }
    
};
app.initialize();
//pgDebug is a quick hack to try to get info from the console into the build.phonegap console
var debuglog = '';
function pgDebugLog(txt){
    debuglog += "\n---\n" + txt;
}
pgDebugLog('init debug logger');

console.log(debuglog);

function showDebugLog(){
    return debuglog;
}





