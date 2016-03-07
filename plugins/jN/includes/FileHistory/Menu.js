var fh = fh || {};
fh.Menu = (function () {
	
	function Menu() {
		this.menu = undefined;
		this.name = fh.Globals.PLUGIN_NAME;
	}
	
	Menu.prototype.create = function (_onClick) {
		_onClick = _onClick || function () {};
		this.menu = Editor.addMenu(this.name);
		this.menu.addItem({
			text: 'Toggle >>>',
			cmd: _onClick
		});
	};
	
	return new Menu();
})();