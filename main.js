require.config({
	baseUrl : "./"
,	paths: {
		"jquery" : "components/jquery/jquery",
	}
,	shim: {
		'thirdparty/colorpicker': ['thirdparty/jquery']
	}
,   waitSeconds : 1
});

require(["jquery"],function($){

	"use strict";

	console.log("JS load complete");

	$(document).ready(function() {
		console.log("DOM tree constructed");
	});

});