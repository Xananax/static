(function (name, context, deps, definition, i) {
	if (typeof module != 'undefined' && module.exports){
		for(i=0; i<deps.length;i++){deps[i] = require[deps[i]] || null;}
		module.exports = definition.apply(context,deps);
	}
	else if (typeof define == 'function' && define.amd){
		define(deps,definition);
	}
	else{
		for(i=0; i<deps.length;i++){deps[i] = context[deps[i]] || null;}
		context[name] = definition.apply(context,deps);
	}
})('race', this, [], function(){

	return function race(){
		var names = Array.prototype.slice.call(arguments)
		,	callback = names.pop()
		,	_isReady = {}
		,	n
		,	check = function check(what){
				_isReady[what] = true;
				for(n in _isReady){
					if(!_isReady[n]){return false;}
				}
				callback();
				return true;
			}
		,	ready = function ready(what){
				return function(){return check(what);}
			}
		;
		for(n in names){_isReady[n] = false;}
		return ready;
	}

});