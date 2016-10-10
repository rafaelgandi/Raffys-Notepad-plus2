/*
	Notepad++ File History
	LM: 2016-09-28
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
	require(fh.Globals.HISTORY_DIR_RELATIVE_PATH + "/Color.js");
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
			
		}
	});	
	
	function __buildList() {		
		if (DOCK_DOCUMENT !== undefined) {
			// Unbind all the attached events first //
			var $li = DOCK_DOCUMENT.getElementsByTagName('li'),
				$a = DOCK_DOCUMENT.getElementsByTagName('a'),
				$i = DOCK_DOCUMENT.getElementsByTagName('i');
			fh.Helpers.unbindEvent('mouseover', $li);
			fh.Helpers.unbindEvent('mouseout', $li);
			fh.Helpers.unbindEvent('dblclick', $li);
			fh.Helpers.unbindEvent('keyup', [DOCK_DOCUMENT.getElementById('fh_filename_field')]);
			fh.Helpers.unbindEvent('mousedown', $a);
			fh.Helpers.unbindEvent('click', $i);
		}	
		seeker.updateFilenames(fh.History.get());	
		DOCK_DOCUMENT = undefined;
		DOCK_DOCUMENT = fh.Dock.buildMarkup();
		DOCK_DOCUMENT.getElementById('fh_file_list').innerHTML = fh.History.buildMarkup();
		// Prevent text selection //
		// See: http://stackoverflow.com/a/6100742
		DOCK_DOCUMENT.onselectstart = function() { return false; };
		__initEvents(DOCK_DOCUMENT);
	}
	
	function __initEvents(dockDocument) {	
		var $li = dockDocument.getElementsByTagName('li'),
			$a = dockDocument.getElementsByTagName('a'),
			$i = DOCK_DOCUMENT.getElementsByTagName('i');		
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
		})
		.bindEvent('click', $i, function ($me, e) { 
			// LM: 2016-10-10
			// See: http://stackoverflow.com/questions/16190455/how-to-detect-controlclick-in-javascript-from-an-onclick-div-attribute
			if (! e.ctrlKey) { 	return; }
			var highlightClass = 'fh_highlight_class';
				currClass = $me.className;
			if (currClass.indexOf(highlightClass) !== -1) {
				// If highlight class exist then remove it.	
				currClass = currClass.replace(highlightClass, '').trim();
				$me.className = currClass;
				fh.Helpers.iterate($i, function ($me) { 
					if ($me.className.indexOf(currClass) !== -1) {
						$me.className = currClass;
					}
				});	
			}
			else {
				// Add highlight class
				$me.className += currClass + ' ' + highlightClass;
				fh.Helpers.iterate($i, function ($me) { 
					if ($me.className.indexOf(currClass) !== -1) {
						$me.className += currClass + ' ' + highlightClass;
					}
				});	
			}			
		});
		
		var prevKeyword = '', wait, enterKeyWait;
		fh.Helpers.bindEvent('keyup', [dockDocument.getElementById('fh_filename_field')], function ($me, e) {			
			var keyword = $me.value.trim(),
				keycode = e.keyCode || e.which;	
			if (keycode === fh.Globals.KeyCode.enter) { // Reset/rebuild list when enter key is pressed
				fh.Dock.window().clearTimeout(enterKeyWait);
				enterKeyWait = fh.Dock.window().setTimeout(function () {
					$me.value = '';
					__buildList();
				}, 200);
				return;
			}
			// If backspace key is being pressed and the keyword is already an 
			// empty string then show all the history list.
			if (keycode === fh.Globals.KeyCode.backspace && keyword === '') {
				fh.Helpers.iterate($li, function ($me) { $me.className = ''; });
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
		
		// Remove from history link event handler //
		fh.Helpers.bindEvent('mousedown', $a, function ($me) {
			if ($me.className.indexOf('fh_remove_link') > -1) { // Filter only remove links
				if (! fh.Dock.window().confirm('Are you sure you want to remove this filename from npp history?')) { return; }
				fh.History.remove($me.rel);
				fh.History.save(true);
				__buildList();
			}
		});
	}
	
})();