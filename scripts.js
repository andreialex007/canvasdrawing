$(function () {
    function application() {
        var self = {};

        self.canvasElement = $(".drawing-canvas")[0];
        self.context = self.canvasElement.getContext("2d");
        self.canvasOffset = $(self.canvasElement).offset();
        self.crayonTextureImage = new Image();
        self.crayonTextureImage.src = "crayon-texture.png";
        self.isDrawing = false;
        self.pointsToDraw = [];
        self.previousPoint = null;

        self.TOOL_BRUSH = "brush";
        self.TOOL_ERASER = "eraser";
        self.TOOL_CRAYON = "crayon";

        self.currentTool = self.TOOL_BRUSH;


        self.STYLE_BRUSH = 'lightgreen';
        self.STYLE_ERASER = 'rgba(0,0,0,1)';

        self.OPERATION_ERASER = "destination-out";
        self.OPERATION_DEFAULT = "source-over";




        self.currentStyle = self.STYLE_BRUSH;
        self.currentOperation = self.OPERATION_DEFAULT;

        self.init = function () {
            $(".surface-overlay")
                .mousedown(function (e) {
                    self.isDrawing = true;
                    self.pointsToDraw = [];
                    self.previousPoint = {
                        x: e.pageX - self.canvasOffset.left,
                        y: e.pageY - self.canvasOffset.top
                    };
                })
                .mouseup(function (event) {
                    self.isDrawing = false;
                    self.previousPoint = null;
                })
                .mousemove(function (event) {
                    if (self.isDrawing) {
                        var currentPoint = {
                            x: event.pageX - self.canvasOffset.left,
                            y: event.pageY - self.canvasOffset.top
                        };
                        self.drawPoints(self.previousPoint, currentPoint);
                        self.previousPoint = currentPoint;
                    }
                });


            $("#Eraser").parent().click(function () {
                self.currentStyle = self.STYLE_ERASER;
                self.currentOperation = self.OPERATION_ERASER;
                self.currentTool = self.TOOL_ERASER;
            });
            $("#Brush").parent().click(function () {
                self.currentTool = self.TOOL_BRUSH;
                self.currentStyle = self.STYLE_BRUSH;
                self.currentOperation = self.OPERATION_DEFAULT;
            });
            $("#Crayon").parent().click(function () {
                self.currentTool = self.TOOL_CRAYON;
            });

            self.initSize();
        }


        self.drawPoints = function (first, second) {

            if (self.currentTool == self.TOOL_CRAYON) {

                $([first, second]).each(function (i, element) {
                    self.context.drawImage(self.crayonTextureImage, element.x, element.y, 10, 10);
                });

                

                return;
            }

            self.context.lineWidth = 10;
            self.context.lineCap = 'round';
            self.context.strokeStyle = self.currentStyle;
            self.context.globalCompositeOperation = self.currentOperation;
            self.context.beginPath();

            $([first, second]).each(function (i, element) {
                self.context.lineTo(element.x, element.y);
            });

            self.context.stroke();
        }


        self.initSize = function () {
            var parent = $(".drawing-canvas").parent();
            $(".drawing-canvas").attr("width", parent.width());
            $(".drawing-canvas").attr("height", parent.height());
        }

        self.init();
        return self;
    }

    window.app = new application();
});