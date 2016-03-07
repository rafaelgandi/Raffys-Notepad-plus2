var fh = fh || {};
fh.Globals = (function () {
	
	function Globals() {
		this.FILE_HISTORY_DIR = require.currentDir + "\\includes\\FileHistory";
		this.HISTORY_DIR_RELATIVE_PATH = 'includes/FileHistory';
		this.PLUGIN_NAME = 'Raffy File History (@_@)';
	}
		
	return new Globals();
})();