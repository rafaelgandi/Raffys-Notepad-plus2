var fh = fh || {};
fh.Helpers = (function () {
	
	function Helpers() {
		
	}
	
	Helpers.prototype.writeToFile = function (_path, _data, _append) {
		var mode = (_append) ? 8 : 2
		// See: http://www.powerobjects.com/2008/09/02/69/
		var FileOpener = new ActiveXObject('Scripting.FileSystemObject');
		// See: https://msdn.microsoft.com/en-us/library/314cz14s(v=vs.84).aspx
		var FilePointer = FileOpener.OpenTextFile(_path, mode, true);
		FilePointer.WriteLine(_data);
		FilePointer.Close();
	};
	
	
	Helpers.prototype.readFile = function (_path) {
		return readFile(_path, "UTF-8");
	};
	
	Helpers.prototype.tpl = function (s,d) {
		// See: http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/	
		for(var p in d) {
			s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
		}	   
		return s;
	};
	
	Helpers.prototype.unique = function (_arr) {
		var noDuplictes = [];
		for	(var i=0; i<_arr.length; i++) {
			if (noDuplictes.indexOf(_arr[i].trim()) < 0) {
				noDuplictes.push(_arr[i].trim());
			}
		}
		return noDuplictes;
	};
	
	Helpers.prototype.bindEvent = function (_event, _elements, _callback) {
		_callback = _callback || function () {};
		var len = _elements.length;
		for (var i=0; i<len; i++) {
			_elements[i]['on' + _event] = (function (i) {
				return function () {
					var e = _elements[i].ownerDocument.parentWindow.event;
					_callback(this, e);
				};
			})(i);
		}
		return this;
	};
	
	Helpers.prototype.unbindEvent = function (_event, _elements) {
		// See: https://plainjs.com/javascript/events/binding-and-unbinding-of-event-handlers-12/
		var len = _elements.length;
		for (var i=0; i<len; i++) {
			delete _elements[i]['on' + _event];
		}
		return this;
	};
	
	Helpers.prototype.iterate = function (_elements, _callback) {
		_callback = _callback || function () {};
		var len = _elements.length;
		for (var i=0; i<len; i++) {
			(function (i) {
				_callback(_elements[i], i);
			})(i);
		}
		return _elements;
	};
	
	return new Helpers();
})();
