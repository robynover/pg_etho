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
        app.setUpPageHeaders();

        /*$('ul.activity_list li a').on("click touchstart",function() {
            console.log(this);
        }*/
        $('ul.activity_list li a').click(function(){
            //console.log(this.name);
            var hidden = '<input type="hidden" name="activity"  value="'+ this.name +'" />';
            $('#activity_choice').html(hidden + "<b>Activity:</b> " + this.name + "<br/>[change]");
            $('#camp_field').toggle();
            $('#observer_form_container').show();
        });
        
        // set listener for form button

        $( "#add_btn" ).on("click touchstart",function() {
            app.onSubmit();
            return false;
         });
        $( "#form1" ).submit(function() {
            app.onSubmit();
            return false;
         });

        /*($( document ).on( "pageshow", "[data-role='page']", function() {
            console.log('pageshow');
        }*/
        //console.log('test debugger');
        //alert('loaded');
        //console.log('ready');
        /*document.addEventListener("menubutton", menuKeyDown, true);
        function menuKeyDown() {
            console.log('menu test debugger');
            alert('Menu button pressed.');
            //$('#menupop').show();
        }*/
        
        //set up handlebars helper
        /*Handlebars.registerHelper('formattedDate', function(timestamp) {
            return moment.utc(timestamp/1000, 'X').zone("-05:00").format('MMMM Do YYYY, H:mm:ss');
        });*/
        //get records from server
        //pouchSync.sync(FROM_CLOUD);
        
        //show existing records
        //app.showRecords();

        
        
        //sync button
        $('#sync_cloud').on("click touchstart",function(){
            console.log('sync fired');
            pouchSync.sync(TO_CLOUD);

        });


    },
    onSubmit: function(){
        app.setInputTime($('#utc_time'));
        if ($('#obs_notes').val().trim().length > 0){
            app.storeInput($('#utc_time').val(),$('#obs_notes').val().trim());
            // clear out the field for the next input
            $('#obs_notes').val('');
        } else {
            alert("Please enter a name");
        }
        return false;
    },
    setInputTime: function(el){
        if(el){
            utc = Date.now(); //current time
            el.val(utc); 
        }
        
    },
    storeInput:function(dt,oname){
        // TODO: add activity data
        // using pouchDB
        newrecord = {'date':dt,'obs_notes':oname};
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
        /*var allPages = $('div[data-role="page"]');

        for (var i = 1; i < allPages.length; i++) {
            allPages[i].innerHTML = theHeader + allPages[i].innerHTML;
        }*/
    }
};
app.initialize();




