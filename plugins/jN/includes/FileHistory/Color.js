var fh = fh || {};
fh.Color = (function () {
	
	function Color() {
		this.DIR_COLORS = {};
	}
	
	// See: http://stackoverflow.com/a/3109564
	function generateColorRGB(ranges) {
		if (!ranges) {
			ranges = [
				[130, 256],
				[130, 256],
				[130, 256]
			];
		}
		var g = function () {
			//select random range and remove
			var range = ranges.splice(Math.floor(Math.random() * ranges.length), 1)[0];
			//pick a random number from within the range
			return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
		}
		return "rgb(" + g() + "," + g() + "," + g() + ")";
	};
	
	Color.prototype.randomHex = (function () {
		var dones = {'rgb(255,255,255)': true};
		return function () {
			var rgb = generateColorRGB();
			while (!! dones[rgb]) {
				rgb = generateColorRGB();
			}
			dones[rgb] = true;
			return rgb;
		};
	})();
	
	function _buildColorMarkup(_pieces) {
		var len = _pieces.length,
			html = '';
		for (var i = 0; i < len; i++) {
			var color = '';
			if (!! this.DIR_COLORS[_pieces[i]]) {
				color = this.DIR_COLORS[_pieces[i]];				
			}
			else {
				color = this.randomHex();
				this.DIR_COLORS[_pieces[i]] = color;
			}
			html += '<i style="color:'+color+'">'+_pieces[i] +'</i>\\';
		}
		return html;
	}
	
	Color.prototype.getColors = function (_filename) {
		var pieces = _filename.trim().split('\\'),
			filename = pieces.pop();
		if (! pieces.length) { return _filename; }	
		return _buildColorMarkup.call(this, pieces) + filename;
	};
	
	return new Color();
})();