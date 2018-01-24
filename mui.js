/*! AtlasMaker: User Interface Elements */

/**
 * @page AtlasMaker: User Interface Elements
 */
var MUI = {
    /**
     * @function slider
     */
    slider: function slider(elem,callback) {
        // Initialise a 'slider' control

        $(elem).data({
            drag:false,
            val:0,
            max:100
        });
    
        var movex=function(el,clientX) {
            if ($(el).data("drag")==true) {
                var R=$(el).find(".mui-track")[0].getBoundingClientRect();
                var x=(clientX-R.left)/R.width;
                if(x<0) x=0;
                if(x>1) x=1;
                x=x*$(el).data("max");
                if(x!=$(el).data("val")) {
                    var max=$(el).data("max");
                    $(el).data("val",x);
                    $(el).find(".mui-thumb")[0].style.left=(x*100/max)+"%";
                    callback(x);
                }
            }
        };
        $(document).on("mousemove",function from_slider(ev){movex(elem,ev.clientX);});
        $(document).on("touchmove",function from_slider(ev){movex(elem,ev.originalEvent.changedTouches[0].pageX);});        
        $(document).on("mouseup touchend",function from_slider(){$(elem).data({drag:false})});
        $(elem).on('mousedown touchstart',function from_slider(){$(elem).data({drag:true})});
    },
    /**
     * @function chose
     */
    chose: function chose(elem,callback) {
        // Initialise a 'chose' control
        var ch=$(elem).find(".mui");
        ch.each(function(c,d){
            $(d).click(function(){
                if($(this).hasClass("mui-pressed")) {
                    callback($(this).attr('title'));
                    return;
                }
                ch.each(function(){$(this).removeClass("mui-pressed")});
                $(this).addClass("mui-pressed");
                if(callback)
                    callback($(this).attr('title'));
            });
        });
    },
    /**
     * @function toggle
     */
    toggle: function toggle(elem,callback) {
        // Initialise a 'toggle' control
        $(elem).click(function(){
            $(this).hasClass("mui-pressed")?$(this).removeClass("mui-pressed"):$(this).addClass("mui-pressed");
            if(callback)
                callback($(this).hasClass("mui-pressed"));
        });
    },
    /**
     * @function push
     */
    push: function push(elem,callback) {
        // Initialise a 'push' control
        $(elem).click(function(){
            if(callback)
                callback();
        });
    },
    /**
      * @function crop
      */
    /**
      * @todo crop takes a string as element, all other functions take $(elem)
      */
    crop: function crop(elem, cb) {
        var mouseIsDown = false;
        var prevPosition = null;
        var prevCrop = null;
        var cropHandle = null;
        var activeElem = null;

        var down = function down(e) {
            mouseIsDown = true;
            activeElem = e.target;

            prevPosition = {
                x: e.pageX,
                y: e.pageY
            };

            var style = document.defaultView.getComputedStyle($(e.data.elem)[0], null);
            prevCrop = {
                top: parseFloat(style.top),
                left: parseFloat(style.left),
                width: parseFloat(style.width),
                height: parseFloat(style.height)
            }

            if($(e.target).hasClass('crop-up')) {
                cropHandle = 'up';
            } else if($(e.target).hasClass('crop-down')) {
                cropHandle = 'down';
            } else if($(e.target).hasClass('crop-right')) {
                cropHandle = 'right';
            } else if($(e.target).hasClass('crop-left')) {
                cropHandle = 'left';
            }
        };
        var move = function move(e, cb) {
            if( !mouseIsDown ) {
                return;
            }

            /* At every mouseUp, all crop divs will trigger this function. Only the one
               that started the mouseDown has activeElem set up
            */
            var curPosition = {
                x: e.pageX,
                y: e.pageY
            };

            var offset = $(e.data.elem).parent().offset();

            switch(cropHandle) {
                case 'up':
                    $(e.data.elem)[0].style.top = prevCrop.top + (curPosition.y - prevPosition.y);
                    $(e.data.elem)[0].style.height = prevCrop.height - (curPosition.y - prevPosition.y);
                    break;
                case 'down':
                    $(e.data.elem)[0].style.height = prevCrop.height + (curPosition.y - prevPosition.y);
                    break;
                case 'right':
                    $(e.data.elem)[0].style.width = prevCrop.width + (curPosition.x - prevPosition.x);
                    break;
                case 'left':
                    $(e.data.elem)[0].style.left = prevCrop.left + (curPosition.x - prevPosition.x);
                    $(e.data.elem)[0].style.width = prevCrop.width - (curPosition.x - prevPosition.x);
                    break;
            }

            var style = document.defaultView.getComputedStyle($(e.data.elem)[0], null);
            if(typeof cb !== 'undefined') {
                cb({
                    top: parseFloat(style.top),
                    left: parseFloat(style.left),
                    width: parseFloat(style.width),
                    height: parseFloat(style.height)
                });
            }
        };
        var up = function up(e, cb) {
            mouseIsDown = false;

            /* At every mouseUp, all crop divs will trigger this function. Only the one
               that started the mouseDown has activeElem set up
            */
            if(!activeElem) {
                return;
            }
            activeElem = null;

            var style = document.defaultView.getComputedStyle($(e.data.elem)[0], null);
            if(typeof cb !== 'undefined') {
                cb({
                    top: parseFloat(style.top),
                    left: parseFloat(style.left),
                    width: parseFloat(style.width),
                    height: parseFloat(style.height)
                });
            }
        };

        $(elem).append([
            '<div class="crop-handle crop-up"></div>',
            '<div class="crop-handle crop-down"></div>',
            '<div class="crop-handle crop-left"></div>',
            '<div class="crop-handle crop-right"></div>'
        ].join('\n'));
        $(elem).css({
            position: 'absolute',
            border: 'thin solid white',
            background: 'rgba(0, 0, 0, 0.0)',
            boxShadow: '0 0 0 150px rgba(0, 0, 0, 0.6)'
        });
        $('body').on('mousedown', elem + ' .crop-handle', {elem: elem}, down);
        $('body').on('mousemove', {elem: elem}, (e) => {move(e, cb)});
        $('body').on('mouseup', {elem: elem}, (e) => {up(e, cb)});
    }
};