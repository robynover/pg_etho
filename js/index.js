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
        //app.loadExternalTemplate('activity_menu','logs_content',null,function(){
            
            $('ul.activity_list li a').click(function(){
                console.log('click li a');
                
                //context is data that will fill in the template
                context = {activity_name: $(this).attr('name'),activity_friendly_name:$(this).html()};
                app.loadExternalTemplate('observer_form','obs_form_content',context,function(){
                    //TODO should be dynamic to form or id name
                    $( "#add_btn" ).on("click",function() {
                        app.onSubmit();
                        return false;
                     });

                    /*$( "#form1" ).submit(function() {
                        //app.onSubmit();
                        return false;
                     });*/

                    //sync button
                    $('#sync_cloud').on("click",function(){
                        console.log('sync fired');
                        pouchSync.sync(TO_CLOUD);

                    });
                    //debug - show records, to check if they've been stored locally
                    pouchSync.all(function(results){
                        console.log(results);
                        //console.log(results);
                        for (r in results){
                            console.log(results[r].doc.obs_notes);
                            /*for (p in results[r]){
                                console.log(results[r][p]);
                                //one-off delete
                                //pouchSync.deleteDoc(esults[r][p]);
                            }*/
                            
                        }
                    });


                });
    
        });

        //});

        
        
        //sync button
        $('#sync_cloud').on("click",function(){
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
    
    loadExternalTemplate: function(path,el,context,callback) {
        console.log('tpl! ');
        
        //var base = window.location.pathname;
        //android needs this filepath instead of window:
        var base = 'file:///android_asset/www/';
        var template;
        //var fullpath = base + "tpl/" + path + '.tpl';
        var fullpath = 'file:///android_asset/www/tpl/' + path + '.tpl';
        console.log('path param: '+path);
        
        $.ajax({
            url: fullpath,
            dataType: "text",
            success: function(data) {
                template  = Handlebars.compile(data);
                html = template;
                if (context){
                    html = template(context);
                }
                $('#' + el).html(html);
                console.log('template success');
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





