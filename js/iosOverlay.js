/*global $*/
/*jshint unused:false,forin:false*/

var iosOverlay = function(params) {

	"use strict";

	var overlayBlock, overlayDOM;
	var noop = function() {};
	var defaults = {
		onbeforeshow: noop,
		onshow: noop,
		onbeforehide: noop,
		onhide: noop,
		text: "",
		icon: null,
		spinner: null,
		duration: null,
		readOnly: true,
		id: null,
		parentEl: null
	};

	// helper - merge two objects together, without using $.extend
	var merge = function (obj1, obj2) {
		var obj3 = {};
		for (var attrOne in obj1) { obj3[attrOne] = obj1[attrOne]; }
		for (var attrTwo in obj2) { obj3[attrTwo] = obj2[attrTwo]; }
		return obj3;
	};


	// setup overlay settings
	var settings = merge(defaults,params);

	// IIFE
	var create = (function() {

		if(settings.readOnly) {
			overlayBlock = document.createElement("div");
			overlayBlock.className = "ui-ios-overlay-block";
			overlayBlock.style.cssText = "display:block;";
			document.body.appendChild(overlayBlock);
		}

		// initial DOM creation and event binding
		overlayDOM = document.createElement("div");
		overlayDOM.className = "ui-ios-overlay";
		overlayDOM.innerHTML += '<span class="title">' + settings.text + '</span>';

		if (params.icon) {
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		} else if (params.spinner) {
			overlayDOM.appendChild(params.spinner.el);
		}

        settings.onbeforeshow();

		if (params.parentEl) {
			document.getElementById(params.parentEl).appendChild(overlayDOM);
		} else {
			document.body.appendChild(overlayDOM);
		}
		
		settings.onshow();

		if (settings.duration) {
			window.setTimeout(function() {
				destroy();
			}, settings.duration);
		}

	}());

    var hide = function() {

        // pre-callback
        settings.onbeforehide();
        
        destroy();
       
    };

	var destroy = function() {

		if (params.parentEl) {
			document.getElementById(params.parentEl).removeChild(overlayDOM);
		} else {
			document.body.removeChild(overlayDOM);
		}
		if(settings.readOnly) {
			document.body.removeChild(overlayBlock);
		}

        settings.onhide();
		
	};

	var update = function(params) {
		if (params.text) {
			overlayDOM.getElementsByTagName("span")[0].innerHTML = params.text;
		}
		if (params.icon) {
			if (settings.spinner) {
				settings.spinner.el.parentNode.removeChild(settings.spinner.el);
				settings.spinner = null;
			}
			overlayDOM.innerHTML += '<img src="' + params.icon + '">';
		}
	};

	return {
		hide: hide,
		destroy: destroy,
		update: update
	};

};
