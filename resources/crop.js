var Crop = {
    crop: function crop(elem, cb) {
        var mouseIsDown = false;
        var prevPosition = null;
        var prevCrop = null;
        var cropHandle = null;

        var down = function down(e) {
            mouseIsDown = true;

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
        var move = function move(e) {
            if( !mouseIsDown ) {
                return;
            }

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
        };
        var up = function up(e, cb) {
            mouseIsDown = false;

            var style = document.defaultView.getComputedStyle($(e.data.elem)[0], null);
            cb({
                top: parseFloat(style.top),
                left: parseFloat(style.left),
                width: parseFloat(style.width),
                height: parseFloat(style.height)
            });
        };

        $(elem).append([
            '<div class="crop-handle crop-up"></div>',
            '<div class="crop-handle crop-down"></div>',
            '<div class="crop-handle crop-left"></div>',
            '<div class="crop-handle crop-right"></div>'
        ].join('\n'));
        $(elem).css({
            border: 'thin solid black',
            background: 'rgba(50, 50, 255, 0.5)'
        });
        $('body').on('mousedown', elem + ' .crop-handle', {elem: elem}, down);
        $('body').on('mousemove', {elem: elem}, move);
        $('body').on('mouseup', {elem: elem}, (e) => {up(e, cb)});
    }
}
