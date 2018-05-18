/*
 * ghindaVideoPlayer - jQuery plugin 1.0.0
 *
 * Copyright (c) 2010 Cristian-Ionut Colceriu
 *
 * www.ghinda.net
 * contact@ghinda.net
 *
 */

(function($) {
	// plugin definition
	$.fn.gVideo = function(options) {		
		// build main options before element iteration		
		var defaults = {
			theme: 'simpledark',
			childtheme: ''
		};
		var options = $.extend(defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			var $gVideo = $(this);
			
			//create html structure
			//main wrapper
			//controls wraper
			var $video_controls = $('<div class="ghinda-video-controls"><a class="ghinda-video-play" title="Play/Pause">Play</a><a class="ghinda-video-pause" title="Pause">Pause</a><a class="ghinda-video-jump" title="Jump">Jump</a><div class="ghinda-video-seek"></div><div class="ghinda-video-timer">00:00</div><div class="video-duration">00:00</div><div id="volContainer"><p>Volume</p><div class="ghinda-volume-slider"></div></div></div></div>');						
			$gVideo.after($video_controls);
			
			//get new elements
			var $video_container = $gVideo.parent('.ghinda-video-player');
			var $video_controls = $('.ghinda-video-controls', $video_container);
			var $ghinda_play_btn = $('.ghinda-video-play', $video_container);
			var $ghinda_pause_btn = $('.ghinda-video-pause', $video_container);
			var $ghinda_jump_btn = $('.ghinda-video-jump', $video_container);
			var $ghinda_video_seek = $('.ghinda-video-seek', $video_container);
			var $ghinda_video_timer = $('.ghinda-video-timer', $video_container);
			var $video_duration = $('.video-duration', $video_container);
			var $ghinda_volume = $('.ghinda-volume-slider', $video_container);
			var $ghinda_volume_btn = $('.ghinda-volume-button', $video_container);
			
			var gPlay = function() {
				if($gVideo.attr('paused') == false) {
					$gVideo[0].pause();					
				} else {					
					$gVideo[0].play();				
				}
			};
			
			var gPause = function() {$gVideo[0].pause();};
			
			
			var gJump = function() {
					
					var curr = $gVideo.attr('currentTime');
					var jumpTime = curr-30;
					
					$gVideo.attr("currentTime",jumpTime);
					//$gVideo[0].play();				

			};

			
			
			$ghinda_play_btn.click(gPlay);
			
			$ghinda_pause_btn.click(gPause);
			
			$ghinda_jump_btn.click(gJump);
			
			$gVideo.click(gPlay);
			
			$gVideo.bind('play', function() {
				$ghinda_play_btn.addClass('ghinda-paused-button');
			});
			
			$gVideo.bind('pause', function() {
				$ghinda_play_btn.removeClass('ghinda-paused-button');
			});
			
			
			
			$gVideo.bind('ended', function() {
				$ghinda_play_btn.removeClass('ghinda-paused-button');
			});
			
			
			
			var seeksliding;			
			var createSeek = function() {
				if($gVideo.attr('readyState')) {
					var video_duration = $gVideo.attr('duration');
					$ghinda_video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: video_duration,
						animate: true,					
						slide: function(){							
							seeksliding = true;
						},
						stop:function(e,ui){
							seeksliding = false;						
							$gVideo.attr("currentTime",ui.value);
						}
					});
					$video_controls.show();					
				} else {
					setTimeout(createSeek, 150);
				}
			};

			createSeek();
		
			var gTimeFormat=function(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};
			
			
			
			var seekUpdate = function() {
				var currenttime = $gVideo.attr('currentTime');
				var duration = $gVideo.attr('duration');
				if(!seeksliding) $ghinda_video_seek.slider('value', currenttime);
				$ghinda_video_timer.text(gTimeFormat(currenttime));
				$video_duration.text(gTimeFormat(duration));	
										
			};
			
			$gVideo.bind('timeupdate', seekUpdate);
			
			$video_duration.text($gVideo.attr('duration'));	
			
			var video_volume = 1;
			$ghinda_volume.slider({
				value: 0.5,
				orientation: "horizontal",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide:function(e,ui){
						$gVideo.attr('muted',false);
						video_volume = ui.value;
						$gVideo.attr('volume',ui.value);
					}
			});
			
			var muteVolume = function() {
				if($gVideo.attr('muted')==true) {
					$gVideo.attr('muted', false);
					$ghinda_volume.slider('value', video_volume);
					
					$ghinda_volume_btn.removeClass('ghinda-volume-mute');					
				} else {
					$gVideo.attr('muted', true);
					$ghinda_volume.slider('value', '0');
					
					$ghinda_volume_btn.addClass('ghinda-volume-mute');
				};
			};
			
			$ghinda_volume_btn.click(muteVolume);
			
			$gVideo.removeAttr('controls');
			
			
			
		});
	};

	//
	// plugin defaults
	//
	$.fn.gVideo.defaults = {		
	};

})(jQuery);
