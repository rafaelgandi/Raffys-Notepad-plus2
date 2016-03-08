var fh = fh || {};
fh.Dock = (function () {
	
	function Dock() {
		this.dock = undefined;
		this.name = fh.Globals.PLUGIN_NAME;
	}
	
	Dock.prototype.create = function () {
		var that = this;
		this.dock = Editor.createDockable({
			name: 'Failure is always an option (@_@)',
			onbeforeclose: function () { return false; },
			onclose:function () {}
		});
		return this.dock;
	};
	
	Dock.prototype.buildMarkup = function () {
		var tpl = fh.Helpers.readFile(fh.Globals.FILE_HISTORY_DIR + "\\dock.html");
			doc = this.dock.document,
			css = fh.Helpers.readFile(fh.Globals.FILE_HISTORY_DIR + "\\css\\dock.css");
		tpl = fh.Helpers.tpl(tpl, { 'style': css });
		doc.write(tpl);
		doc.close();
		//doc.body.innerHTML = '';
		return doc;
	};
	
	Dock.prototype.toggleVisibility = function () {
		// Toggle Dock visibility //	
		if (this.dock.visible) { this.dock.visible = false; }
		else { this.dock.visible = true; }	
	};
	
	return new Dock();
})();