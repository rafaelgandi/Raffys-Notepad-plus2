var fh = fh || {};
fh.History = (function () {
	
	function History() {}
	
	History.prototype.get = function () {
		var data = fh.Helpers.readFile(fh.Globals.FILE_HISTORY_DIR + "\\history.txt"),
			filesArr = data.split(',');
		if (! filesArr.length) {
			Editor.alert('No history data found');
			return [];
		}
		return fh.Helpers.unique(filesArr);
	};
	
	History.prototype.removeDuplicates = function () {
		var fileNames = this.get(),
			finalArr = [];
		for (var i=0; i<fileNames.length; i++) {
			if (fileNames[i].indexOf('\\') === -1) { continue; } // Dont include "new <number>" files
			finalArr.push(fileNames[i].trim());
		}
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\history.txt", (',' + finalArr.join(',')));
	};
	
	History.prototype.save = function (_append) {
		if (! currentView.files.length) {
			Editor.alert('No files opened');
			return;
		}
		var fileNames = currentView.files,
			finalArr = [];
		for (var i=0; i<fileNames.length; i++) {
			if (fileNames[i].indexOf('\\') === -1) { continue; } // Dont include "new <number>" files
			finalArr.push(fileNames[i].trim());
		}
		finalArr = fh.Helpers.unique(finalArr);
		fh.Helpers.writeToFile(fh.Globals.FILE_HISTORY_DIR + "\\history.txt", (',' + finalArr.join(',')), _append);
	};
	
	History.prototype.buildMarkup = function () {
		var html = '';
			fileNames = this.get();
		if (! fileNames.length) { return html; }
		fileNames = fh.Helpers.unique(fileNames);
		if (! fileNames.length) { return html; }
		for (var i=0; i<fileNames.length; i++) {
			if (fileNames[i].trim() == '') { continue; }
			html += '<li id="file_'+i+'" rel="'+fileNames[i]+'">'+fileNames[i]+'</li>';
		}
		return html;
	};
	
	History.prototype.open = function (_path) {
		try { Editor.open(_path); }
		catch (err) { Editor.alert('Something went wrong'); }
	};
	
	return new History();
})();