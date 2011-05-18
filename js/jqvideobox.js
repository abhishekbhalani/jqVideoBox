﻿/*
 jqVideoBox 1.50
 - Jquery version required: 1.2.x - 1.6.0
 - SWFObject version required: v2.x

 Changelog:
 - 1.5 added support for dailymotion.com, blip.tv, revver.com, veoh.com, vimeo.com
   added paging in specific group
   some minor fixes
   swfobject 2.x support added
  
 - 1.00 ported from mootools plugin videbox (http://videobox-lb.sourceforge.net/) to jquery
 */

/* Coded by: emposha <admin@emposha.com> */
/* Copyright: Emposha.com <http://www.emposha.com/> - Distributed under MIT - Keep this message! */

/*
 * Main idea and concept mootools plugin videbox (http://videobox-lb.sourceforge.net/)
 */

/*
 * width               - Width of the lightbox
 * height              - Height of the lightbox
 * animateCaption      - Enable/Disable caption animation
 * defaultOverLayFade  - Default overlay fade value
 * flvplayer  	       - Path to default flash player
 * getimage		 	       - Get image from service
 * navigation          - Activate navigation
 */

jQuery( function ($) {
  var curstack = null;
  var curelement = 0;
  $.fn.jqvideobox = function (opt) {
    var stack = this;
    return this.each( function() {
      function init() {
        if ($("#lbOverlay").length == 0) {
          var _overlay = $(document.createElement("div")).attr({"id": "lbOverlay"}).click(closeMe);
          var _center = $(document.createElement("div")).attr({"id": "lbCenter"}).css({'width': options.initialWidth+'px','height': options.initialHeight+'px', 'display': 'none'});          
          var _bottomContainer = $(document.createElement("div")).attr({"id": "lbBottomContainer"}).css('display', 'none');
          var _bottom = $(document.createElement("div")).attr('id', 'lbBottom');
          var _close = $(document.createElement("a")).attr({id: 'lbCloseLink',href: '#'}).click(closeMe);
          var _caption = $(document.createElement("div")).attr('id', 'lbCaption');
          var _number = $(document.createElement("div")).attr('id', 'lbNumber');
          var _clear = $(document.createElement("div")).css('clear', 'both');
          var _prevlink = $('<a href="#" id="lbPrevLink"></a>').click(prevVideo);
          var _nextlink = $('<a href="#" id="lbNextLink"></a>').click(nextVideo);
          
          _bottom.append(_close).append(_caption).append(_number).append(_clear);
          _bottomContainer.append(_bottom);
          
          $("body").append(_overlay).append(_center).append(_bottomContainer)
          if (!options.navigation) {
            _prevlink.hide();
            _nextlink.hide(); 
          }
          _overlay.append(_prevlink).append(_nextlink); 
        }

        overlay = $("#lbOverlay");
        center = $("#lbCenter");
        caption = $("#lbCaption");
        bottomContainer = $("#lbBottomContainer");
        prevlink = $("#lbPrevLink");
        nextlink = $("#lbNextLink");
        
        element.click(activate);
        
        if (options.getimage) {
          getImage();
        }
      }

      function getImage() {
        var href = element.attr('href');
        var path = title = '';
        
        switch (getType(href)) {
          case 'youtube':
            var videoId = href.split('=');
            path = 'http://i2.ytimg.com/vi/'+videoId[1]+'/default.jpg';
            break;
          
          case 'metacafe':
            var videoId = href.split('/');
            path = 'http://gen.metacafe.com/thumb/'+videoId[4]+'/0/0/0/0/'+videoId[5]+'.jpg';
            break;
          
          case 'revver':
            var videoId = href.split('/');
            path = 'http://frame.revver.com/frame/120x90/'+videoId[4]+'.jpg';
            break;
          case 'youporn':
            var videoId = href.split('/');
            var path = 'http://ss-2.youporn.com/screenshot/57/68/screenshot_multiple/'+videoId[4]+'/'+videoId[4]+'_multiple_1_large.jpg';
            break;
          default:
            title = element.text();
            path = 'css/video_icon.png';
            break;
        }
        
        if (path) {
          var content = '<img src="' + path + '" style="width:100px; height:100px;">'
          if (title)  {
            element.css('position', 'relative');
            content += '<span class="lbImageCaption">'+title+'</span>';
          }
          element.html(content);
        }
      }

      function prevVideo() {
        curelement = curelement - 1;
        if (curelement < 0 ) { 
          curelement = 0;
        }
        closeMe();
        setTimeout(function() {$(curstack[curelement]).click();}, 1);
        return false;
      }

      function nextVideo() {
        curelement = curelement + 1;
        if (curelement ==  curstack.length ) { 
          curelement = curstack.length - 1;
        }
        closeMe();
        setTimeout(function() {$(curstack[curelement]).click();}, 1);
        return false;
      }
      
      function getType(href) {
        var type = '';
        if (href.match(/youtube\.com\/watch/i)) {
          type = 'youtube';
        }
        else if (href.match(/metacafe\.com\/watch/i)) {
          type = 'metacafe';
        }
        else if (href.match(/google\.com\/videoplay/i)) {
          type = 'google';
        }
        else if (href.match(/dailymotion\.com\/video/i)) {
          type = 'dailymotion';
        }
        else if (href.match(/blip\.tv\/play/i)) {
          type = 'blip';
        }
        else if (href.match(/myspace\.com\/video/i)) {
          type = 'myspace';
        }
        else if (href.match(/hulu\.com\/watch/i)) {
          type = 'hulu';
        }
        else if (href.match(/revver\.com\/video/i)) {
          type = 'revver';
        }
        else if (href.match(/veoh\.com\/watch/i)) {
          type = 'veoh';
        }
        else if (href.match(/vimeo\.com\//i)) {
          type = 'vimeo';
        }
        else if (href.match(/\.mov/i)) {
          type = 'mov_file';
        }
        else if (href.match(/\.wmv/i) || href.match(/\.asx/i)) {
          type = 'wmv_file';
        }
        else if (href.match(/\.flv/i)) {
          type = 'flv_file';
        }
        return type;
      }

      function closeMe() {
        overlay.hide();
        center.hide();
        bottomContainer.hide();
        prevlink.hide();
        nextlink.hide();
        center.html('');
        return false;
      }

      function activate() {
        curstack = stack;
        $.each(curstack, function (i, elem) {
          if (element.index(elem) == 0) {
            curelement = i;
          }
        });
        var attributes = setup(href);
        top = $(window).scrollTop() + (($(window).height() / 2) - (options.height / 2));
        left= (($(window).width() / 2) - (options.width / 2));
        center.css({'top': top + 'px','left':  left + 'px','display': 'none','background': '#fff url(css/loading.gif) no-repeat center','height': options.contentsHeight,'width': options.contentsWidth});
        overlay.css('display','block').fadeTo("fast",options.defaultOverLayFade);
        caption.html(title);
        center.fadeIn("slow", function() {insert(attributes);});
        return false;
      }

      function insert(attributes) {
        center.css('background','#fff');
        if (flash) {
          center.append('<div id="lbCenter_wraper"></div>');
          var attr = {'id': attributes.id, 'name': attributes.id};
          var params = {'wmode': 'transparent'};
          var flashvars = false;
          swfobject.embedSWF(attributes.src, 'lbCenter_wraper', attributes.width, attributes.height, "9.0.0", "expressInstall.swf", flashvars, params, attributes);
        }
        else {
          center.html(other);
        }
        
        bottomContainer.css({'top': (top + center.height() + 10) + "px",'left': center.css('left'),'width': options.contentsWidth+'px'});
        
        if (options.animateCaption) {
          bottomContainer.slideDown('slow');
        } else {
          bottomContainer.css('display','block');
        }
        if (options.navigation) {
          if (curelement != 0) {
            prevlink.css({'top': (top + (options.height /2 )) + "px", 'display': 'block', 'left':  (parseInt(center.css('left'),10) - 53) + 'px'});
          }
          if ((curelement + 1) != curstack.length) {
            nextlink.css({'top': (top + (options.height /2 )) + "px", 'display': 'block', 'left':  (parseInt(center.css('left'),10) + options.width) + 'px'});
          }
        }
      }

      function setup(href) {
        var aDim;
        if (typeof (rel) != 'undefined') {
          aDim = rel.match(/[0-9]+/g);
        }
        overlay.css({
          'top': $(window).scrollTop()+'px',
          'height': $(window).height()+'px'
        });
        options.contentsWidth = (aDim && (aDim[0] > 0)) ? aDim[0] : options.width;
        options.contentsHeight = (aDim && (aDim[1] > 0)) ? aDim[1] : options.height;

        var attributes = {'width': options.contentsWidth, 'height': options.contentsHeight, 'id': 'flvvideo'};
        var  type = getType(href);
        switch (type) {
          case 'youtube':
              flash = true;
              var videoId = href.split('=');
              attributes.src = "http://www.youtube.com/v/" + videoId[1];
            break;
            
          case 'metacafe':
              flash = true;
              var videoId = href.split('/');
              attributes.src = "http://www.metacafe.com/fplayer/" + videoId[4] + "/.swf";
            break;
            
          case 'google':
            flash = true;
            var videoId = href.split('=');
            attributes.src = "http://video.google.com/googleplayer.swf?docId=" + videoId[1] + "&hl=en";
            break;
            
          case 'dailymotion':
            flash = false;
            var videoId = href.replace(/(.*)video\/(.*?)_(.*)/, '$2');
            other = '<iframe frameborder="0" width="' + options.contentsWidth + '" height="' + options.contentsHeight + '" src="http://www.dailymotion.com/embed/video/' + videoId + '?theme=none&wmode=transparent"></iframe>';
            break;
            
          case 'blip':
            flash = true;
            attributes.src = href;
            break;
            
          /*case 'myspace':
            flash = true;
            var videoId = href.split('/');
            attributes.src = "http://player.hulu.com/embed/myspace_player_v002.swf?pid=50149139&embed=true&videoID=" + videoId[6];
            break;
            
          case 'hulu':
            flash = true;
            var videoId = href.split('/');
            attributes.src = "http://player.hulu.com/embed/myspace_player_v002.swf?pid=50149139&embed=true&videoID=" + videoId[2];
            break;*/
            
          case 'revver':
            flash = true;
            var videoId = href.split('/');
            attributes.src = "http://flash.revver.com/player/1.0/player.swf?mediaId=" + videoId[4];
            break;
            
          case 'veoh':
            flash = true;
            var videoId = href.split('/');
            attributes.src = "http://www.veoh.com/static/swf/veoh/MediaPlayerWrapper.swf?permalinkId=" + videoId[4];
            break;
          
          case 'vimeo':
            flash = false;
            var videoId = href.split('/');
            other = '<iframe frameborder="0" width="' + options.contentsWidth + '" height="' + options.contentsHeight + '" src="http://player.vimeo.com/video/' + videoId[3] + '?title=0&byline=0&portrait=0"></iframe>';
            break;
            
          case 'mov_file':
            flash = false;
            if (navigator.plugins && navigator.plugins.length) {
              other ='<object id="qtboxMovie" type="video/quicktime" codebase="http://www.apple.com/qtactivex/qtplugin.cab" data="'+sLinkHref+'" width="'+options.contentsWidth+'" height="'+options.contentsHeight+'"><param name="src" value="'+sLinkHref+'" /><param name="scale" value="aspect" /><param name="controller" value="true" /><param name="autoplay" value="true" /><param name="bgcolor" value="#000000" /><param name="enablejavascript" value="true" /></object>';
            } else {
              other = '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" width="'+options.contentsWidth+'" height="'+options.contentsHeight+'" id="qtboxMovie"><param name="src" value="'+sLinkHref+'" /><param name="scale" value="aspect" /><param name="controller" value="true" /><param name="autoplay" value="true" /><param name="bgcolor" value="#000000" /><param name="enablejavascript" value="true" /></object>';
            }
            break;
            
          case 'wmv_file':
            flash = false;
            other = '<object NAME="Player" WIDTH="'+options.contentsWidth+'" HEIGHT="'+options.contentsHeight+'" align="left" hspace="0" type="application/x-oleobject" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"><param NAME="URL" VALUE="'+sLinkHref+'"><param><param NAME="AUTOSTART" VALUE="false"></param><param name="showControls" value="true"></param><embed WIDTH="'+options.contentsWidth+'" HEIGHT="'+options.contentsHeight+'" align="left" hspace="0" SRC="'+sLinkHref+'" TYPE="application/x-oleobject" AUTOSTART="false"></embed></object>'
            break;
            
          case 'flv_file':
            flash = true;
            attributes.src = options.flvplayer+"?file="+sLinkHref;
            break;
            
          default:
            flash = true;
            attributes.src = videoID;
            break;
        }
        return attributes;
      }

      var options = $.extend({
        initialWidth: 250,		// Initial width of the box (px)
        initialHeight: 250,		// Initial height of the box (px)
        width: 425,		// Default width of the box (px)
        height: 350,	// Default height of the box (px)
        animateCaption: true,	// Enable/Disable caption animation
        defaultOverLayFade: 0.8,	//Default overlay fade value
        getimage: false,
        navigation: false,
        flvplayer: 'swf/flvplayer.swf'
      }, opt);

      //system vars
      var overlay, center, caption, bottomContainer, so, flash, videoID, other, top;
      var element = $(this);
      var href = element.attr("href");
      var title = element.attr("title");
      var rel = element.attr("rel");
      //lets start it
      init();
    });
  }
}
);