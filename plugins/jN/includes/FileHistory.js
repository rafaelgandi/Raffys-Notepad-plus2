/*
	Notepad++ File History
	LM: 2016-03-08
	@author: Rafael Gandionco
	
	See: https://github.com/sieukrem/jn-npp-plugin/wiki
	See: http://jn-npp-plugin.googlecode.com/svn/wiki/API/api.xml
*/
(function () {
	var DOCK_DOCUMENT,
		DOCK;	
	require(require.currentDir + "\\includes\\FileHistory\\Globals.js");
	fh.Globals.FILE_HISTORY_DIR = require.currentDir + "\\includes\\FileHistory";	
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/polyfill.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Helpers.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/History.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Menu.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Dock.js");
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Seeker.js");
	
	// Try to remove the duplicates on startup //
	fh.History.removeDuplicatesAndSave();
	// On startup save all the currently opened files to the history //
	fh.History.save(true);
	var seeker = new fh.Seeker(fh.History.get());
	
	// Create the dock here on npp startup //
	DOCK = fh.Dock.create();	
	__buildList();
		
	// Create the menus here
	fh.Menu.create()
	.addSubMenu({
		text: 'Hide/Show Dock\tCtrl+Shift+Arrow Down',
		ctrl: true,
		shift: true,
		key: fh.Globals.KeyCode.arrowDown, 
		cmd: function () {
			fh.Dock.toggleVisibility();
		}
	}, true)
	.addSubMenu({
		text: 'Save History',
		cmd: function () {
			fh.History.save(true);
			__buildList();
			Editor.alert('History saved!');
		}
	})
	.addSubMenu({
		text: 'Clear History',
		cmd: function () {
			if (fh.Dock.window().confirm('Are you sure you want to clear all the history stored?')) {
				fh.History.clear();
				__buildList();
				Editor.alert('File history cleared');
			}
		}
	})
	.addSubMenu({
		text: 'About ?',
		cmd: (function () {
			var data = '';
			return function () {
				if (data.trim() === '') {
					data = fh.Helpers.readFile(fh.Globals.FILE_HISTORY_DIR + '/about.txt');
				}
				Editor.alert(data);
			}
		})()
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
		seeker.updateFilenames(fh.History.get());	
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
		})
		.bindEvent('keyup', $li, function ($me, e) { 
			// Usually runs when user is using the tab button to navigate 
			// through the list.
			var keycode = e.keyCode || e.which;
			// Open file when enter key is pressed //
			if (keycode === fh.Globals.KeyCode.enter) {
				fh.History.open($me.rel.trim());
				fh.History.save(true);
			}
		});
		
		var prevKeyword = '', wait;
		fh.Helpers.bindEvent('keyup', [dockDocument.getElementById('fh_filename_field')], function ($me, e) {			
			var keyword = $me.value.trim(),
				keycode = e.keyCode || e.which;	
			if (keycode === fh.Globals.KeyCode.enter) { // Reset list when enter key is pressed
				$me.value = '';
				fh.Helpers.iterate($li, function ($me) { $me.className = ''; });
				return;
			}
			// On arrow down remove focus from the textbox so the whole dock window 
			// can scroll down.
			if (keycode === fh.Globals.KeyCode.arrowDown) { $me.blur(); }
			if (keyword == '') { return; }
			if (keyword.length <= 1) { return; } // Must be a valid keyword
			if (keyword == prevKeyword) { return; }
			prevKeyword = keyword;
			// Wait for the user to finish typing first before doing the necessary
			// work. It pays to be lazy here.
			fh.Dock.window().clearTimeout(wait);
			wait = fh.Dock.window().setTimeout(function () {
				var matches = seeker.sift($me.value);
				// Reset first //
				fh.Helpers.iterate($li, function ($me) { $me.className = ''; });
				// Hide all file links that are not a match //
				fh.Helpers.iterate($li, function ($me) {
					var fileName = $me.rel.trim();
					if (matches.indexOf(fileName) == -1) {					
						$me.className = 'fh_hide';
					}
				});		
			}, 300);	
		})
		.bindEvent('focus', [dockDocument.getElementById('fh_filename_field')], function ($me) { 
			$me.value = '';
		});	
	}
	
})();