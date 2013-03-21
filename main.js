require.config({
	baseUrl : "./"
,	paths: {
		"jquery" : "components/jquery/jquery",
	}
,	shim: {
		'thirdparty/colorpicker': ['thirdparty/jquery']
	,	'templates': {'exports':'jade'}
	}
,   waitSeconds : 1
});

require(["jquery","templates"],function($,jade){

	var	elCache = {}
	,	$w = $(window)
	,	defaultPage = '#featured'
	;

	function getEl(el){
		if(!elCache.hasOwnProperty(el)){
			elCache[el] = $(el);
			if(!elCache[el].length){elCache[el] = false;}
		}
		return elCache[el];
	}

	function inView(){
		$toLoad.not('processed').filter(function(){
			var $e = $(this)
			, th = 0
			, wt = $w.scrollTop()
			, wb = wt + $w.height()
			, et = $e.offset().top
			, eb = et + $e.height()
			;
			return eb >= wt - th && et <= wb + th;
		}).each(function(){
			lazyLoadImage($(this));
		})
	}


	function route(hash){
		hash = (hash || defaultPage).split('-');
		var pageId = hash.shift()
		,	movieId = (hash.shift() || '0')
		,	page = pageId+'-page'
		,	movie = pageId+'-' + movieId
		,	link = pageId+'-link'
		,	$page = getEl(page)
		,	$link = getEl(link)
		;
		getEl('.page').not($page.addClass('active')).removeClass('active');
		getEl('#Navigation a').not($link.addClass('active')).removeClass('active');
	}

	$w.on('hashchange',function(){route(location.hash);})

	$(document).ready(function() {
			
		$("a[href^=#]").on("click", function(evt){
			evt.preventDefault();
			var hash = '#'+this.href.split('#').pop()
			route(hash);
			history.pushState({}, "", hash);
		});
			
		route(location.hash || null);

	});

});