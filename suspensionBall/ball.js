(function(global, ap) {
  var $ = window.$;
  function createBall(html) {
    var $el = $('.J-drag-ball');
    if ($el.length > 0) {
      return $el.html(html);
    } else {
      var wrapHtml = ['<div style="position: fixed; top:90%; right:0; z-index: 1000;" class="J-drag-ball">', html, '</div>'].join('');
      return $(wrapHtml).appendTo(document.body);
    }
  }
  function getPos(event, rect, limit) {
    var touchObj = (event.originalEvent.targetTouches && event.originalEvent.targetTouches[0]) ||
      (event.originalEvent.touches && event.originalEvent.touches[0]) ||
      (event.originalEvent.changedTouches && event.originalEvent.changedTouches[0]) ||
      ((event.pageX || event.page) && event);
    var pos;
    if (touchObj) {
      pos = {
        x: touchObj.clientX,
        y: touchObj.clientY
      };
    } else {
      pos = {
        x: event.clientX,
        y: event.clientY
      };
    }
    pos.x = pos.x - (rect.width / 2);
    pos.y = pos.y - (rect.height / 2);
    pos.x = pos.x < limit.minLeft ? limit.minLeft : pos.x;
    pos.x = pos.x > limit.maxLeft ? limit.maxLeft : pos.x;
    // pos.y = pos.y < limit.minTop ? limit.minTop : pos.y;
    pos.y = pos.y > limit.maxTop ? limit.maxTop : pos.y;
    return pos;
  }
  function DragBall(options) {
    this.html = options.html = options.html || '<div style="width:50px; height:50px; background:#ccc;"></div>';
  };

  DragBall.prototype.init = function() {
    this.$el = createBall(this.html);
    this.bindEvent();
  };

  DragBall.prototype.bindEvent = function() {
    var self = this;
    var currentRect = {};
    var poslimit = {
      minTop: 60,
      maxTop: document.documentElement.clientHeight,
      minLeft: 0,
      maxLeft: document.documentElement.clientWidth
    };
    var top = 0;
    function stopBodyScroll (isFixed) {
      let bodyEl = document.body;
      if (isFixed) {
        top = window.scrollY;
        bodyEl.style.position = 'fixed';
        bodyEl.style.top = -top + 'px';
      } else {
        bodyEl.style.position = '';
        bodyEl.style.top = '';
        window.scrollTo(0, top); // 回到原先的top
      }
    }
    // $(document).on('touchmove', function(e) {
    //   flag && e.preventDefault();
    // });
    $('body').on('touchstart', '.J-drag-ball', function(e) {
      console.log('touchstart');
      e = e || window.event;
      var rect = currentRect = self.$el[0].getBoundingClientRect();
      poslimit.maxLeft = document.documentElement.clientWidth - currentRect.width;
      poslimit.maxTop = document.documentElement.clientHeight - currentRect.height;
      self.$el.css({
        'opacity': 0.65
      });
      ap.allowBack({
        allowGesture: false
      });
      stopBodyScroll(true);
    })
    .on('touchmove', '.J-drag-ball', function(e) {
      e.stopPropagation();
      console.log('touchmove');
      e = e || window.event;
      var domPos = getPos(e, currentRect, poslimit);
      self.$el.css({
        'left': domPos.x,
        'top': domPos.y,
        'right': 'initial',
        'bottom': 'initial'
      });
    })
    .on('touchend', '.J-drag-ball', function(e) {
      stopBodyScroll(false);
      console.log('touchend');
      var pos = getPos(e, currentRect, poslimit);
      ap.allowBack({
        allowGesture: true
      });
      self.$el.css({
        'opacity': 1,
        'transition': 'position 0.15s ease-in'
      });
      pos = self.resetPos(pos, poslimit);
      self.$el.css({
        'left': pos.x,
        'top': pos.y
      });
      setTimeout(function () {
        self.$el.css('transition', '');
      }, 150);
    });
  };

  DragBall.prototype.resetPos = function(pos, poslimit) {
    const middleWidth = Math.ceil(poslimit.maxLeft / 2);
    if (pos.x < middleWidth) {
      pos.x = 0;
    } else {
      pos.x = poslimit.maxLeft;
    }
    pos.y = pos.y < poslimit.minTop ? poslimit.minTop : pos.y;
    return pos;
  };

  global.dragBall = DragBall;
})(window, ap);
