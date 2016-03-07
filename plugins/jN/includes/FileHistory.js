/*
	Notepad++ File History
	LM: 2016-03-07	
	@author: Rafael Gandionco
	
	See: https://github.com/sieukrem/jn-npp-plugin/wiki
	See: http://jn-npp-plugin.googlecode.com/svn/wiki/API/api.xml
*/
(function () {
	var DOCK_DOCUMENT,
		DOCK;	
	require(require.currentDir + "\\includes\\FileHistory\\Globals.js");
	fh.Globals.FILE_HISTORY_DIR = require.currentDir + "\\includes\\FileHistory";
	
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Helpers.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/History.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Menu.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Dock.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Shower.js");
	
	// Try to remove the duplicates on startup //
	fh.History.removeDuplicates();
	// On startup save all the currently opened files to the history //
	fh.History.save(true);
	var shower = new fh.Shower(fh.History.get());
	
	// Create the dock here on npp startup //
	DOCK = fh.Dock.create();	
	__buildList();
		
	// Create the menu here
	fh.Menu.create(function () {
		// Toggle Dock visibility //	
		if (DOCK.visible) { DOCK.visible = false; }
		else { DOCK.visible = true; }		
	});
		
	// Everytime a file is opened save it to the history //
	GlobalListener.addListener({
		FILEOPENED: function (v,pos) {
			fh.History.save(true);
			__buildList();
		}	
	});	
	
	function __buildList() {		
		if (DOCK_DOCUMENT !== undefined) {
			// Unbind all the attached events first //
			var $li = DOCK_DOCUMENT.getElementsByTagName('li');
			fh.Helpers.unbindEvent('mouseover', $li);
			fh.Helpers.unbindEvent('mouseout', $li);
			fh.Helpers.unbindEvent('dblclick', $li);
			fh.Helpers.unbindEvent('keyup', [DOCK_DOCUMENT.getElementById('fh_filename_field')]);
		}	
		shower.updateFilenames(fh.History.get());	
		DOCK_DOCUMENT = undefined;
		DOCK_DOCUMENT = fh.Dock.buildMarkup();
		DOCK_DOCUMENT.getElementById('fh_file_list').innerHTML = fh.History.buildMarkup();
		__initEvents(DOCK_DOCUMENT);
	}
	
	function __initEvents(dockDocument) {	
		var $li = dockDocument.getElementsByTagName('li');		
		fh.Helpers
		.bindEvent('mouseover', $li, function ($me) { $me.className = 'fh_hover'; })	
		.bindEvent('mouseout', $li, function ($me) { $me.className = '';})
		.bindEvent('dblclick', $li, function ($me) { 
			fh.History.open($me.rel.trim());
			fh.History.save(true);
		});
		
		var prevKeyword = '';
		fh.Helpers.bindEvent('keyup', [dockDocument.getElementById('fh_filename_field')], function ($me, e) {
			var keyword = $me.value.trim()
			if (keyword == '') { return; }
			if (keyword == prevKeyword) { return; }
			prevKeyword = keyword;
			var matches = shower.siff($me.value);
			// Reset first //
			fh.Helpers.iterate($li, function ($me) { $me.className = ''; });
			// Hide all file links that are not a match //
			fh.Helpers.iterate($li, function ($me) {
				var fileName = $me.rel.trim();
				if (matches.indexOf(fileName) == -1) {
					$me.className = 'fh_hide';
				}
			});	
		});	
	}
	
})();