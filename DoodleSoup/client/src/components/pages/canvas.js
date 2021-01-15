import React, { Component } from "react";
import "../../utilities.css";
import "./canvas.css"

//UNDO FILL DOESNT WORK

let CANVASWIDTH = 50;
let CANVASHEIGHT = 50;
let myCanvas = null;
let context = null;

//const rect = canvas.getBoundingClientRect() <-Fix for positioning
//https://stackoverflow.com/questions/53960651/how-to-make-an-undo-function-in-canvas <- Undo Button
const RADIUSSHIFT = 11;
//test comment delete this plz
class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawing : false,

            verticalShift : 0,
            horizontalShift : 0,

            strokeSize : 10,
            strokeColor : "rgba(0, 0, 0, 1)",

            strokePaths : [],
            tempPoints : [],

            filling : false,
        };
    };

    componentDidMount() {
        document.title = "Create!";
        myCanvas = document.querySelector('.canvas');
        context = myCanvas.getContext("2d");

        myCanvas.width = CANVASWIDTH;
        myCanvas.height = CANVASHEIGHT;

        this.setState({verticalShift : myCanvas.getBoundingClientRect().top + RADIUSSHIFT});
        this.setState({horizontalShift : myCanvas.getBoundingClientRect().left + RADIUSSHIFT});

        window.addEventListener("resize", this.recalibrate);
        this.clearAll()
    };

    recalibrate = () => {
        this.setState({verticalShift : myCanvas.getBoundingClientRect().top + RADIUSSHIFT});
        this.setState({horizontalShift : myCanvas.getBoundingClientRect().left + RADIUSSHIFT});
    }

    handleEvent = (event) => {
        if (this.state.filling == false) {
            if (event.type === "mousedown") {
                this.startDrawing(event);
    
            } else if (event.type === "mouseup") {
                this.endDrawing();
    
            } else if (event.type === "mousemove") {
                this.drawing(event);
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

    drawing = (event) => {
        if (this.state.drawing === false) {
            return
        }

        //Formatting
        context.lineWidth = this.state.strokeSize;
        context.strokeStyle = this.state.strokeColor;
        context.lineCap = "round";

        //Draw
        context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        context.stroke();
        context.beginPath();
        context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);

        //Keep track of points
        let temp = [...this.state.tempPoints];
        temp.push(
            {'x': event.clientX, 
            'y': event.clientY, 
            'color': this.state.strokeColor,
            'size': this.state.strokeSize});

        this.setState({tempPoints : temp});
    }

    startDrawing = (event) => {
        this.setState({drawing : true})

        //Formatting
        context.lineWidth = this.state.strokeSize;
        context.strokeStyle = this.state.strokeColor;
        context.lineCap = "round";

        //Make Dots
        context.beginPath();
        context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        context.stroke();

        //Keep Track of Dots

        let input = [
        {'x': event.clientX, 
        'y': event.clientY, 
        'color': this.state.strokeColor,
        'size': this.state.strokeSize}]
        this.setState({tempPoints : input})
    }

    endDrawing = () => {
        //Reset Lines
        context.beginPath();
        this.setState({drawing : false});

        let temp = [...this.state.strokePaths];
        temp.push([...this.state.tempPoints]);
        this.setState({strokePaths : temp});
        this.setState({tempPoints : []});
    }

    clearAll = () => {
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillRect(0, 0, myCanvas.width, myCanvas.height);

        this.setState({strokePaths : []});
        this.setState({tempPoints : []});
    }

    changeStrokeSize = (event) => {
        this.setState({strokeSize : event.target.value})
    }

    submitDrawing = () => {
        //TODO
    }

    undoStroke = () => {
        context.clearRect(0, 0, myCanvas.width, myCanvas.height);

        this.recreatePaths()
        let temp = [...this.state.strokePaths]
        temp.pop()
        this.setState({strokePaths : temp})
    }

    recreatePaths = () => {
        // draw all the paths in the paths array
        console.log(this.state.strokePaths)
        for(let stroke = 0; stroke < this.state.strokePaths.length - 1; stroke++) {
            if (this.state.strokePaths[stroke][0] === "FILLING") {
                let newColor = this.state.strokePaths[stroke][2]

                let arrayIndex = this.state.strokePaths[stroke][1];

                let agenda = [arrayIndex];
                let visited = new Set();
                visited.add(arrayIndex)

                let image = context.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)
                let imageData = image.data;

                let colorToChange = [imageData[arrayIndex], imageData[arrayIndex + 1], imageData[arrayIndex + 2], imageData[arrayIndex + 3]]
                while (agenda.length != 0) {
                    let currentPixel = agenda.pop()

                    this.colorPixel(imageData, currentPixel, newColor)
                    let neighbors = this.findNeighbors(currentPixel, visited, colorToChange, imageData)

                    for (let n = 0; n < neighbors.length; n++) {
                        agenda.push(neighbors[n])
                        visited.add(neighbors[n])
                    }
                }
                context.putImageData(image, 0, 0);
                //console.log(newColor, colorToChange, arrayIndex)
                //console.log(imageData)

            } else {
                //Formatting
                context.lineWidth = this.state.strokePaths[stroke][0].size;
                context.strokeStyle = this.state.strokePaths[stroke][0].color;
                context.lineCap = "round";

                //Make Dots
                context.beginPath();
                context.moveTo(this.state.strokePaths[stroke][0].x - this.state.horizontalShift, this.state.strokePaths[stroke][0].y - this.state.verticalShift);
                context.lineTo(this.state.strokePaths[stroke][0].x - this.state.horizontalShift, this.state.strokePaths[stroke][0].y - this.state.verticalShift);
                context.stroke();

                for(let coor = 1; coor < this.state.strokePaths[stroke].length; coor++) {
                    //Draw
                    context.lineTo(this.state.strokePaths[stroke][coor].x - this.state.horizontalShift, this.state.strokePaths[stroke][coor].y - this.state.verticalShift);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(this.state.strokePaths[stroke][coor].x - this.state.horizontalShift, this.state.strokePaths[stroke][coor].y - this.state.verticalShift);
                };
                context.beginPath();
            };
        };       
    }  

    commenceFill = () => {
        this.setState({filling : true})
    }

    startFilling = (event) => {
        let newColor = this.state.strokeColor.match(/\d+/g)

        let coords = {x: event.clientX  - this.state.horizontalShift, y: event.clientY - this.state.verticalShift}
        let arrayIndex = (((coords.y | 0)* CANVASWIDTH + (coords.x | 0)) * 4);

        let agenda = [arrayIndex];
        let visited = new Set();
        visited.add(arrayIndex)

        let image = context.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)
        let imageData = image.data;

        let colorToChange = [imageData[arrayIndex], imageData[arrayIndex + 1], imageData[arrayIndex + 2], imageData[arrayIndex + 3]]
        while (agenda.length != 0) {
            let currentPixel = agenda.pop()

            this.colorPixel(imageData, currentPixel, newColor)
            let neighbors = this.findNeighbors(currentPixel, visited, colorToChange, imageData)

            for (let n = 0; n < neighbors.length; n++) {
                agenda.push(neighbors[n])
                visited.add(neighbors[n])
            }
        }
        context.putImageData(image, 0, 0);
        this.setState({tempPoints : ["FILLING", arrayIndex, newColor]});
    }

    findNeighbors = (index, visited, colorCheck, imageData) => {
        let contestants = [index - 4, index + 4, index + 4*CANVASWIDTH, index - 4*CANVASWIDTH]
        let neighbors = []

        for (let i = 0; i < contestants.length; i++) {
            if (contestants[i] < CANVASWIDTH*CANVASHEIGHT*4 && contestants[i] > -1 && (visited.has(contestants[i])===false)) {

                let pixel = [imageData[contestants[i]], imageData[contestants[i] + 1], imageData[contestants[i] + 2], imageData[contestants[i] + 3]]

                if (pixel.every((val, i) => val === colorCheck[i])) {
                    neighbors.push(contestants[i])
                }
            }
        }
        return (neighbors)
    }

    endFilling = () => {
        this.setState({filling : false});
        let temp = [...this.state.strokePaths];
        temp.push([...this.state.tempPoints]);
        this.setState({strokePaths : temp});
        this.setState({tempPoints : []});
    }

    colorPixel = (imageData, pixelPos, color) => {
        imageData[pixelPos] = color[0];
        imageData[pixelPos + 1] = color[1];
        imageData[pixelPos + 2] = color[2];
        if (imageData[pixelPos + 3] === 0) {
            imageData[pixelPos + 3] = 1;
        }
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