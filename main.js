require.config({
	baseUrl : "./"
,	paths: {
		"jquery" : "components/jquery/jquery"
	,	"brightcove":"third-party/brightcove/index"
	,	"race":"js/race"
	}
,	shim: {
		'thirdparty/colorpicker': ['thirdparty/jquery']
	,	'templates': {'exports':'jade'}
	}
,   waitSeconds : 1
});
	
require(["jquery","templates","brightcove","race"],function($,jade,BCL,race){

	var ready = race('dom','repo','brightcove',function(){console.log('all good!')});

	ready('repo')();

	console.log('dfsdfsd')

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
		console.log(pageId);
	}

	$w.on('hashchange',function(){route(location.hash);})

	$(document).ready(function() {
			
		ready('dom')();

		$("a[href^=#]").on("click", function(evt){
			evt.preventDefault();
			var hash = '#'+this.href.split('#').pop()
			route(hash);
			history.pushState({}, "", hash);
		});

		BCL.setup({
			insertInto:'#Player'
		,	log:false
		,	player:{
				'width':'100%'
			,	'height':'50%'
			//,	'wmode':'opaque'
			//,	"@videoPlayer":"2112931747001"
			}
		})
		.on('*',function(evt){
			console.log('::-[ bc event ]-::',evt);
		})
		.init(ready('bc'));

		route(location.hash || null);

	});

});