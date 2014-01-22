// sync local storage with remote couchDB
var TO_CLOUD = 1;
var FROM_CLOUD = 2;
var BOTH = 3;
var pouchSync = {

	//remoteCouch: 'http://ethoinfo.iriscouch.com/ethorecords',
	//cloudant url: https://USERNAME:PASSWORD@USERNAME.cloudant.com/DATABASE 
	remoteCouch: 'https://ethoinfo:4Z0oSqk7@ethoinfo.cloudant.com/ethorecords', //cloudant won't work bc cross-origin policy
	db: PouchDB('ethorecords'),

	add: function(record){
		// take existing record object 
		// with post, pouch will add _id if there isn't one (using put requires _id value)
		
		this.db.post(record, function callback(err, result) {
			if (!err) {
				console.log('Successfully added a record!');
			} else {
				console.log('could not add record');
			}
		});
	},
	all: function(callback){ //takes a callback function in order to return records
		this.db.allDocs({include_docs: true},  //descending: true
			function (err, doc) {
		    	callback(doc.rows);
			});
	},
	sync: function(dir){ 
		/* direction options: TO_CLOUD, FROM_CLOUD, BOTH*/
		if (!dir){dir = TO_CLOUD;}
		console.log('syncing');
		var opts = {continuous: false,complete:function(){alert('Sync complete');}};
		if (dir == TO_CLOUD || dir == BOTH){
			this.db.replicate.to(this.remoteCouch, opts);
		}
		if (dir == FROM_CLOUD || dir == BOTH){
			this.db.replicate.from(this.remoteCouch, opts);
		}
		
	}
};


//newthing = {'date':123,'obs_name':'Robyn'}; //new record
//pouchSync.add(newthing);
//pouchSync.sync();
/*pouchSync.all(function(returnval){
	console.log(returnval);
});*/

//console.log(pouchSync.rows);

/*pouchSync.db.allDocs({include_docs: true, descending: true},myCallback());
function myCallback(err,doc){
	//console.log('calling back');
}*/
