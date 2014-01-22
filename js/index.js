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
        
        document.addEventListener("menubutton", menuKeyDown, true);
        function menuKeyDown() {
            //alert('Menu button pressed.');
            $('#menupop').show();
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
        //alert('loaded');
        //console.log('ready');
        
        //set up handlebars helper
        /*Handlebars.registerHelper('formattedDate', function(timestamp) {
            return moment.utc(timestamp/1000, 'X').zone("-05:00").format('MMMM Do YYYY, H:mm:ss');
        });*/
        //get records from server
        //pouchSync.sync(FROM_CLOUD);
        
        //show existing records
        //app.showRecords();

        // set listener for form button

        /*$( "#add_btn" ).on("click touchstart",function() {
            app.onSubmit();
            return false;
         });
        $( "#form1" ).submit(function() {
            app.onSubmit();
            return false;
         });
        //sync button
        $('#sync_cloud').on("click touchstart",function(){
            console.log('sync fired');
            pouchSync.sync(TO_CLOUD);

        });*/


    },
    onSubmit: function(){
        app.setInputTime($('#utc_time'));
        if ($('#oname').val().trim().length > 0){
            app.storeInput($('#utc_time').val(),$('#oname').val().trim());
            // clear out the field for the next input
            $('#oname').val('');
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
        // using pouchDB
        newrecord = {'date':dt,'obs_name':oname};
        pouchSync.add(newrecord);
        //append to <ul> list of records in real time
        this.appendToRecordLi($( "#record_list" ),oname,dt);

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
    }
};
app.initialize();




