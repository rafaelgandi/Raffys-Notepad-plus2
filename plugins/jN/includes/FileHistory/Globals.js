var fh = fh || {};
fh.Globals = (function () {
	
	function Globals() {
		this.FILE_HISTORY_DIR = require.currentDir + "\\includes\\FileHistory";
		this.HISTORY_DIR_RELATIVE_PATH = 'includes/FileHistory';
		this.PLUGIN_NAME = 'Raffy File History (@_@)';
		// See: https://css-tricks.com/snippets/javascript/javascript-keycodes/
		this.KeyCode = {
			enter: 13,
			arrowDown: 40
		};
	}	
	return new Globals();
})();