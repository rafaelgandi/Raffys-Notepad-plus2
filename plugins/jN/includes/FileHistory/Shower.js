var fh = fh || {};
fh.Shower = (function () {
	
	function Shower(_filenames) {
		this.fileNames = _filenames;
	}

	Shower.prototype.updateFilenames = function (_filenames) {
		this.fileNames = fh.Helpers.unique(this.fileNames.concat(_filenames));
		return this.fileNames
	};
	
	Shower.prototype.siff = function (_keyword) {
		// NOTE: Case insensitive //
		var k = _keyword.trim().toLowerCase(),
			resultArr = [];
		if (k == '') { return []; }
		var fileNames = this.fileNames;
		for (var i=0; i<fileNames.length; i++) {
			if (fileNames[i].toLowerCase().indexOf(k) > -1) {
				resultArr.push(fileNames[i]);
			}
		}
		return resultArr;
	};
		
	return Shower;
})();