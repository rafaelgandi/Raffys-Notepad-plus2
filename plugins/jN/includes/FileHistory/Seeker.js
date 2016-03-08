var fh = fh || {};
fh.Seeker = (function () {
	
	function Seeker(_filenames) {
		this.fileNames = _filenames;
	}

	Seeker.prototype.updateFilenames = function (_filenames) {
		this.fileNames = fh.Helpers.unique(this.fileNames.concat(_filenames));
		return this.fileNames
	};
	
	Seeker.prototype.sift = function (_keyword) {
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
		
	return Seeker;
})();