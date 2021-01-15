import React, { Component } from "react";
import "../../utilities.css";
import "./canvas.css"

//UNDO FILL DOESNT WORK

let CANVASWIDTH = 1000;
let CANVASHEIGHT = 600;

let myCanvas = null;
let context = null;

let tempPoints = [];
let strokePaths = [];

let verticalShift = 0;
let horizontalShift = 0;

//const rect = canvas.getBoundingClientRect() <-Fix for positioning
//https://stackoverflow.com/questions/53960651/how-to-make-an-undo-function-in-canvas <- Undo Button
const RADIUSSHIFT = 11;

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawing : false,

            strokeSize : 10,
            strokeColor : "rgba(0, 0, 0, 1)", 

            filling : false,
        };
    };

    //TECH
    componentDidMount() {
        document.title = "Create!";
        myCanvas = document.querySelector('.canvas');
        context = myCanvas.getContext("2d");

        myCanvas.width = CANVASWIDTH;
        myCanvas.height = CANVASHEIGHT;

        context.lineCap = "round";

        verticalShift = myCanvas.getBoundingClientRect().top + RADIUSSHIFT;
        horizontalShift = myCanvas.getBoundingClientRect().left + RADIUSSHIFT;

        window.addEventListener("resize", this.recalibrate);
        this.clearAll()
    };

    recalibrate = () => {
        verticalShift = myCanvas.getBoundingClientRect().top + RADIUSSHIFT;
        horizontalShift = myCanvas.getBoundingClientRect().left + RADIUSSHIFT;
    }

    handleEvent = (event) => {
        if (this.state.filling == false) {
            if (event.type === "mousedown") {
                this.commenceInitialDrawing(event);
    
            } else if (event.type === "mouseup") {
                this.endDrawing();
    
            } else if (event.type === "mousemove") {
                this.commenceDrawing(event);
            }
        }
        else {
            if (event.type === "mousedown") {
                this.startFilling(event);
    
            } else if (event.type === "mouseup") {
                this.endFilling();
            }
        }
        
    };

    //CANVAS DRAW
    commenceDrawing = (event) => {
        if (this.state.drawing === false) {
            return
        }
        this.drawing(event.clientX, event.clientY, this.state.strokeColor, this.state.strokeSize)
    }

    drawing = (x, y, color, size, retracing = false) => {
        //Formatting
        context.lineWidth = size;
        context.strokeStyle = color;

        //Draw
        context.lineTo(x - horizontalShift, y - verticalShift);
        context.stroke();
        context.beginPath();
        context.moveTo(x - horizontalShift, y - verticalShift);

        //Keep track of points
        if (retracing === false) {
            let temp = [...tempPoints];
            temp.push(
                {'x': x, 
                'y': y, 
                'color': this.state.strokeColor,
                'size': this.state.strokeSize});
            tempPoints = temp;
        }
    }

    commenceInitialDrawing = (event) => {
        this.initializeDrawing(event.clientX, event.clientY, this.state.strokeColor, this.state.strokeSize)
    }

    initializeDrawing = (x, y, color, size, retracing = false) => {
        this.setState({drawing : true})

        //Formatting
        context.lineWidth = size;
        context.strokeStyle = color;

        //Make Dots
        context.beginPath();
        context.moveTo(x - horizontalShift, y - verticalShift);
        context.lineTo(x - horizontalShift, y - verticalShift);
        context.stroke();

        if (retracing === false) {
            //Keep Track of Dots
            let input = [
                {'x': x, 
                'y': y, 
                'color': this.state.strokeColor,
                'size': this.state.strokeSize}]
            tempPoints = input;
        }
    }

    endDrawing = () => {
        //Reset Lines
        context.beginPath();
        this.setState({drawing : false});

        let temp = [...strokePaths];
        temp.push([...tempPoints]);
        strokePaths = temp;
        tempPoints = [];
    }

    //CANVAS FILL
    commenceFill = () => {
        this.setState({filling : true})
    }

    startFilling = (event) => {
        let coords = {x: event.clientX  - horizontalShift, y: event.clientY - verticalShift}
        let arrayIndex = (((coords.y | 0)* CANVASWIDTH + (coords.x | 0)) * 4);
        this.fill(arrayIndex, this.state.strokeColor.match(/\d+/g))
    }

    fill = (arrayIndex, newColor, retracing = false) => {
        let agenda = [arrayIndex];
        let visited = new Set();
        visited.add(arrayIndex)

        let image = context.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)
        let imageData = image.data;

        let colorToChange = [imageData[arrayIndex], imageData[arrayIndex + 1], imageData[arrayIndex + 2], imageData[arrayIndex + 3]]

        while (agenda.length != 0) {
            let currentPixel = agenda.pop()

            this.colorPixel(imageData, currentPixel, newColor);
            let neighbors = this.findNeighbors(currentPixel, visited, colorToChange, imageData);

            let n = null;
            neighbors.forEach(n => agenda.push(n), visited.add(n))
        }

        context.putImageData(image, 0, 0);
        if (retracing === false) {
            tempPoints = ["FILLING", arrayIndex, newColor];
        }
    }

    findNeighbors = (index, visited, colorCheck, imageData) => {
        let contestants = [index - 4, index + 4, index + 4*CANVASWIDTH, index - 4*CANVASWIDTH]
        let bounds = contestants.filter(c => c < CANVASWIDTH*CANVASHEIGHT*4 && c > -1 && (visited.has(c)===false));
        let neighbors = bounds.filter(b => imageData[b] === colorCheck[0] && imageData[b + 1] === colorCheck[1] && imageData[b + 2] === colorCheck[2] && imageData[b + 3] === colorCheck[3])
        return (neighbors)
    }

    endFilling = () => {
        this.setState({filling : false});
        let temp = [...strokePaths];
        temp.push([...tempPoints]);
        strokePaths = temp;
        tempPoints = [];
    }

    colorPixel = (imageData, pixelPos, color) => {
        imageData[pixelPos] = color[0];
        imageData[pixelPos + 1] = color[1];
        imageData[pixelPos + 2] = color[2];

        if (imageData[pixelPos + 3] === 0) {
            imageData[pixelPos + 3] = 1;
        }
    }

    //UNDO
    undoStroke = () => {
        context.clearRect(0, 0, myCanvas.width, myCanvas.height);

        this.recreatePaths()
        let temp = [...strokePaths]
        temp.pop()
        strokePaths = temp;
    }

    recreatePaths = () => {
        // draw all the paths in the paths array
        let stroke =  null;

        let temp = strokePaths.slice(0, -1)
        temp.forEach(stroke => 
            {
                if (stroke[0] === "FILLING") {
                    this.fill(stroke[1], stroke[2], true)
                } else {
                    //Recreate Stroke
                    this.initializeDrawing(stroke[0].x, stroke[0].y, stroke[0].color, stroke[0].size, true)
            
                    let connectedStroke = stroke.slice(1);
                    let coor = null;

                    //Redraw Strokes
                    connectedStroke.forEach(coor => {this.drawing(coor.x, coor.y, coor.color, coor.size, true)})
                    this.setState({drawing : false}
                    )
                    context.beginPath();
                };
            }
        )
    }

    clearAll = () => {
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillRect(0, 0, myCanvas.width, myCanvas.height);

        strokePaths = [];
        tempPoints = [];
    }

    //Change Stroke Attributes
    changeStrokeSize = (event) => {
        this.setState({strokeSize : event.target.value})
    }
    changeRed = () => {
        this.setState(
            {strokeColor : "rgba(255, 0, 0, 1)"}
        )
    }
    changeOrange = () => {
        this.setState(
            {strokeColor : "rgba(255, 165, 0, 1)"}
        )
    }
    changeYellow = () => {
        this.setState(
            {strokeColor : "rgba(255, 255, 0, 1)"}
        )
    }
    changeGreen = () => {
        this.setState(
            {strokeColor : "rgba(0, 128, 0, 1)"}
        )
    }
    changeBlue = () => {
        this.setState(
            {strokeColor : "rgba(0, 0, 255, 1)"}
        )
    }
    changePurple = () => {
        this.setState(
            {strokeColor : "rgba(128, 0, 128, 1)"}
        )
    }
    changePink = () => {
        this.setState(
            {strokeColor : "rgba(255, 192, 203, 1)"}
        )
    }
    changeBrown = () => {
        this.setState(
            {strokeColor : "rgba(165, 42, 42, 1)"}
        )
    }
    changeBlack = () => {
        this.setState(
            {strokeColor : "rgba(0, 0, 0, 1)"}
        )
    }
    changeGrey = () => {
        this.setState(
            {strokeColor : "rgba(128, 128, 128, 1)"}
        )
    }
    changeWhite = () => {
        this.setState(
            {strokeColor : "rgba(255, 255, 255, 1)"}
        )
    }

    //SUBMIT
    submitDrawing = () => {
        //TODO
    }


    render() {
        return (
            <div>
                <canvas className="canvas" onMouseDown={this.handleEvent} onMouseUp={this.handleEvent} onMouseMove={this.handleEvent}></canvas>
                <input className="strokeSize" value={this.state.strokeSize} onChange={this.changeStrokeSize}/>
                <button className="canvas-color red" onClick={this.changeRed}></button>  
                <button className="canvas-color orange" onClick={this.changeOrange}></button>  
                <button className="canvas-color yellow" onClick={this.changeYellow}></button>  
                <button className="canvas-color green" onClick={this.changeGreen}></button>  
                <button className="canvas-color blue" onClick={this.changeBlue}></button>  
                <button className="canvas-color purple" onClick={this.changePurple}></button>  
                <button className="canvas-color pink" onClick={this.changePink}></button>  
                <button className="canvas-color brown" onClick={this.changeBrown}></button>  
                <button className="canvas-color black" onClick={this.changeBlack}></button>  
                <button className="canvas-color grey" onClick={this.changeGrey}></button>  
                <button className="canvas-color white" onClick={this.changeWhite}></button>  
                <button className="clearButton" onClick={this.clearAll}> Clear </button>
                <button className="submitButton" onClick={this.submitDrawing}> Submit </button>
                <button className="undoButton" onClick={this.undoStroke}> Undo </button>
                <button className="fillButton" onClick={this.commenceFill}> Fill </button>
            </div>
        )
    }
}

export default Canvas;