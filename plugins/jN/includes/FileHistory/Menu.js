var fh = fh || {};
fh.Menu = (function () {
	
	function Menu() {
		this.menu = undefined;
		this.name = fh.Globals.PLUGIN_NAME;
	}
	
	Menu.prototype.create = function () {
		this.menu = Editor.addMenu(this.name);
		return this;
	};
	
	Menu.prototype.addSubMenu = function (_opt, _hotkey) {
		this.menu.addItem(_opt);
		if (_hotkey) {
			addHotKey(_opt);
		}
		return this;
	};
	
	return new Menu();
})();