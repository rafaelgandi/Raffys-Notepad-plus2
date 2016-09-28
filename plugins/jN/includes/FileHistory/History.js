var fh = fh || {};
fh.History = (function () {
	
	function History() {
		this.HISTORY_FILENAME = 'history.txt';
	}
	
	History.prototype.isNewFile = function (_fileName) {
		return (_fileName.trim().indexOf('\\') === -1);
	};
	
	History.prototype.removeNewFiles = function (_fileNameArray) {
		var len = _fileNameArray.length,
			finalArr = [];
		for (var i=0; i<len; i++) {
			if (this.isNewFile(_fileNameArray[i])) { continue; } // Dont include "new <number>" files
			finalArr.push(_fileNameArray[i].trim());
		}
		return finalArr;
	};
	
	History.prototype.clear = function () {
		// Clear the whole file...
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\" + this.HISTORY_FILENAME, '');
		// Save the current opened tabs...
		this.save();
		return this;
	};
	
	History.prototype.get = function () {
		var data = fh.Helpers.readFile(fh.Globals.FILE_HISTORY_DIR + "\\" + this.HISTORY_FILENAME),
			filesArr = data.split(',');
		// No history data found.
		if (! filesArr.length) { return []; }
		// If only one, then it is still considered as nothing is found.
		if (filesArr.length === 1) { return [];	} 
		filesArr = this.removeNewFiles(filesArr);
		return fh.Helpers.unique(filesArr);
	};
	
	History.prototype.removeDuplicatesAndSave = function () {
		var fileNames = this.get(),
			finalArr = [];
		for (var i=0; i<fileNames.length; i++) {
			if (this.isNewFile(fileNames[i])) { continue; } // Dont include "new <number>" files
			finalArr.push(fileNames[i].trim());
		}
		// Overwrite the whole contents with the cleaned(no duplicates) 
		// array of files here.
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\" + this.HISTORY_FILENAME, (',' + finalArr.join(',')));
	};
	
	History.prototype.save = function (_append) {
		var fileNames = this.removeNewFiles(currentView.files),
			finalArr = [];
		if (! fileNames.length) {
			Editor.alert('No files opened');
			return;
		}		
		for (var i=0; i<fileNames.length; i++) {
			if (this.isNewFile(fileNames[i])) { continue; } // Dont include "new <number>" files
			finalArr.push(fileNames[i].trim());
		}
		finalArr = fh.Helpers.unique(finalArr);
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\" + this.HISTORY_FILENAME, (',' + finalArr.join(',')), _append);
	};
	
	History.prototype.remove = function (_filename) {
		var fileNames = this.get(),
			finalArr = [];
		for (var i=0; i<fileNames.length; i++) {
			if (this.isNewFile(fileNames[i])) { continue; } // Dont include "new <number>" files
			if (fileNames[i].trim() != _filename.trim()) {
				finalArr.push(fileNames[i].trim());
			}
		}
		finalArr = fh.Helpers.unique(finalArr);
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\" + this.HISTORY_FILENAME, (',' + finalArr.join(',')));
	};
	
	History.prototype.buildMarkup = function () {
		var html = '';
			fileNames = this.get();
		if (! fileNames.length) { return html; }
		fileNames = fh.Helpers.unique(fileNames);
		if (! fileNames.length) { return html; }
		for (var i=0; i<fileNames.length; i++) {
			if (fileNames[i].trim() == '') { continue; }
			
			// See: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
			html += '<li tabindex="0" id="file_'+i+'" rel="'+fileNames[i]+'">' + fh.Color.getColors(fileNames[i]) + ' <a class="fh_remove_link" href="#" title="Remove this file from history" onclick="return false;" rel="'+fileNames[i]+'">[x]</a></li>';
		}
		return html;
	};
	
	History.prototype.open = function (_path) {
		try { Editor.open(_path); }
		catch (err) { Editor.alert('Something went wrong'); }
	};
	
	return new History();
})();