import React, { Component } from "react";
import { Link } from "@reach/router";
import "../../utilities.css";
import "./canvas.css";
import { post, get } from "../../utilities";

//Hardcoded canvas size and other variables
const CANVASWIDTH = 1000;
const CANVASHEIGHT = 600;
const FILLVAR = 40;
let myCanvas = null;
let context = null;
let tempPoints = [];
let strokePaths = [];
let verticalShift = 0;
let horizontalShift = 0;

//const rect = canvas.getBoundingClientRect() <-Fix for positioning
//https://stackoverflow.com/questions/53960651/how-to-make-an-undo-function-in-canvas <- Undo Button
const RADIUSSHIFT = 11;

//Save functionality, https://www.youtube.com/watch?v=YoVJWZrS2WU&ab_channel=dcode
const downloadImage = (myCanvas) => {
    const dataURI = myCanvas.toDataURL();
    //Enable the if statement to add functionality for internet explorer

    //if (windows.navigator.msSaveBlob) {
    //    window.navigator.msSaveBlob(myCanvas.msToBlob(), "canvas-image.png");
    //} else {
        const temp = document.createElement("a");
        document.body.appendChild(temp);
        temp.href = myCanvas.toDataURL();
        temp.download = "canvas-image.png";
        temp.click();
        document.body.removeChild(temp);
    //}
}

//Converts the canvas image to an URI
const toURI = (myCanvas) => {
    const dataURI = myCanvas.toDataURL();
    console.log(dataURI);
    return dataURI;
}

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawing: false,
            strokeSize: 10,
            strokeColor: "rgba(0, 0, 0, 255)", 
            action: 'drawing',
            user: undefined, 
            //uri: this.props.uri,
        };
    };

    //calls a function outside of React JS that is written
    //in javascript to save image
    promptSubmit = () => {
        document.querySelector('.popUp').style.display = 'flex';
    }

    closePromptSubmit = () => {
        document.querySelector('.popUp').style.display = 'none';
    }
    
    submitDrawing = () => {
        
        let canvasURI = toURI(myCanvas);
        console.log(this.state.user.name);
        const body = {
            //We dont need to stringify creator_id or source
            creator_name: this.state.user.name,
            creator_id: this.props.userId,
            source: canvasURI,
        };
        post("/api/work", body);
        this.clearAll()
    }

    downloadDrawing = () => {
        downloadImage(myCanvas);
    }

    componentDidMount() {
        get(`/api/user`, {userid: this.props.userId }).then((user) => this.setState({ user: user }));
        document.title = "Create!";
        myCanvas = document.querySelector('.canvas');
        context = myCanvas.getContext("2d");

        myCanvas.width = CANVASWIDTH;
        myCanvas.height = CANVASHEIGHT;

        context.lineCap = "round";

        verticalShift = myCanvas.getBoundingClientRect().top + RADIUSSHIFT;
        horizontalShift = myCanvas.getBoundingClientRect().left + RADIUSSHIFT;

        window.addEventListener("resize", this.recalibrate);
        window.addEventListener("scroll", this.recalibrate);
        this.clearAll()

    };

    recalibrate = () => {
        verticalShift = myCanvas.getBoundingClientRect().top + RADIUSSHIFT;
        horizontalShift = myCanvas.getBoundingClientRect().left + RADIUSSHIFT;
    }

    handleEvent = (event) => {
        if (this.state.action === "drawing") {
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
    drawingAction = () => {
        this.setState({action : "drawing"})
    }

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
    fillingAction = () => {
        this.setState({action : "filling"})
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
        console.log(arrayIndex, newColor, colorToChange)

        context.putImageData(image, 0, 0);
        if (retracing === false) {
            tempPoints = ["FILLING", arrayIndex, newColor];
        }
    }

    findNeighbors = (index, visited, colorCheck, imageData) => {
        let contestants = [index - 4, index + 4, index + 4*CANVASWIDTH, index - 4*CANVASWIDTH]
        let bounds = contestants.filter(c => c < CANVASWIDTH*CANVASHEIGHT*4 && c > -1 && (visited.has(c)===false));
        let neighbors = bounds.filter(b => 
                                      imageData[b] > colorCheck[0] - FILLVAR && imageData[b] < colorCheck[0] + FILLVAR &&
                                      imageData[b + 1] > colorCheck[1] - FILLVAR && imageData[b + 1] < colorCheck[1] + FILLVAR &&
                                      imageData[b + 2] > colorCheck[2] - FILLVAR && imageData[b + 2] < colorCheck[2] + FILLVAR &&
                                      imageData[b + 3] > colorCheck[3] - FILLVAR && imageData[b + 3] < colorCheck[3] + FILLVAR)
        return (neighbors)
    }

    endFilling = () => {
        let temp = [...strokePaths];
        temp.push([...tempPoints]);
        strokePaths = temp;
        tempPoints = [];
    }

    colorPixel = (imageData, pixelPos, color) => {
        imageData[pixelPos] = color[0];
        imageData[pixelPos + 1] = color[1];
        imageData[pixelPos + 2] = color[2];
        imageData[pixelPos + 3] = 255;
    }

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
        context.fillStyle = "rgba(255, 255, 255, 255)";
        context.fillRect(0, 0, myCanvas.width, myCanvas.height);
        strokePaths = [];
        tempPoints = [];
    }

    //Change brush color
    changeStrokeSize = (event) => {this.setState({strokeSize : event.target.value})}
    changeRed = () => {this.setState({strokeColor : "rgba(255, 0, 0, 255)"})}
    changeOrange = () => {this.setState({strokeColor : "rgba(255, 165, 0, 255)"})}
    changeYellow = () => {this.setState({strokeColor : "rgba(255, 255, 0, 255)"})}
    changeGreen = () => {this.setState({strokeColor : "rgba(0, 128, 0, 255)"})}
    changeBlue = () => {this.setState({strokeColor : "rgba(0, 0, 255, 255)"})}
    changePurple = () => {this.setState({strokeColor : "rgba(128, 0, 128, 255)"})}
    changePink = () => {this.setState({strokeColor : "rgba(255, 192, 203, 255)"})}
    changeBrown = () => {this.setState({strokeColor : "rgba(165, 42, 42, 255)"})}
    changeBlack = () => {this.setState({strokeColor : "rgba(0, 0, 0, 255)"})}
    changeGray = () => {this.setState({strokeColor : "rgba(128, 128, 128, 255)"})}
    changeWhite = () => {this.setState({strokeColor : "rgba(255, 255, 255, 255)"})}
    changeLime = () => {this.setState({strokeColor : "rgba(0, 255, 0, 255)"})}
    changeCoral = () => {this.setState({strokeColor : "rgba(255, 127, 80, 255)"})}
    changeDarkRed = () => {this.setState({strokeColor : "rgba(100, 0, 0, 255)"})}
    changeViolet = () => {this.setState({strokeColor : "rgba(238, 130, 239, 255)"})}
    changeNavy = () => {this.setState({strokeColor : "rgba(0, 0, 128, 255)"})}
    changeCyan = () => {this.setState({strokeColor : "rgba(0, 255, 255, 255)"})}
    changeLightGray = () => {this.setState({strokeColor : "rgba(211, 211, 211, 255)"})}
    changeGoldenRod = () => {this.setState({strokeColor : "rgba(218, 165, 32, 255)"})}
    changeIndigo = () => {this.setState({strokeColor : "rgba(75, 0, 130, 255)"})}

    render() {
        return (
            <div>
                <canvas className="canvas" onMouseDown={this.handleEvent} onMouseUp={this.handleEvent} onMouseMove={this.handleEvent}></canvas>
                {/**Color panel */} 
                <div className="controlPanel">
                    <div className="colorPanel">
                        <button className={(this.state.strokeColor==="rgba(255, 255, 255, 255)") ? "canvas-color white buttonSelected" : "canvas-color white"} onClick={this.changeWhite}></button>  
                        <button className={(this.state.strokeColor==="rgba(211, 211, 211, 255)") ? "canvas-color lightGray buttonSelected" : "canvas-color lightGray"} onClick={this.changeLightGray}></button>  
                        <button className={(this.state.strokeColor==="rgba(255, 0, 0, 255)") ? "canvas-color red buttonSelected" : "canvas-color red"} onClick={this.changeRed}></button>  
                        <button className={(this.state.strokeColor==="rgba(255, 165, 0, 255)") ? "canvas-color orange buttonSelected" : "canvas-color orange"} onClick={this.changeOrange}></button>  
                        <button className={(this.state.strokeColor==="rgba(255, 255, 0, 255)") ? "canvas-color yellow buttonSelected" : "canvas-color yellow"} onClick={this.changeOrange} onClick={this.changeYellow}></button> 
                        <button className={(this.state.strokeColor==="rgba(0, 255, 0, 255)") ? "canvas-color lime buttonSelected" : "canvas-color lime"} onClick={this.changeOrange} onClick={this.changeLime}></button>  
                        <button className={(this.state.strokeColor==="rgba(0, 255, 255, 255)") ? "canvas-color cyan buttonSelected" : "canvas-color cyan"} onClick={this.changeOrange} onClick={this.changeCyan}></button>   
                        <button className={(this.state.strokeColor==="rgba(128, 0, 128, 255)") ? "canvas-color purple buttonSelected" : "canvas-color purple"} onClick={this.changeOrange} onClick={this.changePurple}></button> 
                        <button className={(this.state.strokeColor==="rgba(238, 130, 239, 255)") ? "canvas-color violet buttonSelected" : "canvas-color violet"} onClick={this.changeOrange} onClick={this.changeViolet}></button>   
                        <button className={(this.state.strokeColor==="rgba(255, 192, 203, 255)") ? "canvas-color pink buttonSelected" : "canvas-color pink"} onClick={this.changePink}></button> 
                        <button className={(this.state.strokeColor==="rgba(0, 0, 0, 255)") ? "canvas-color black buttonSelected" : "canvas-color black"} onClick={this.changeBlack}></button>  
                        <button className={(this.state.strokeColor==="rgba(128, 128, 128, 255)") ? "canvas-color gray buttonSelected" : "canvas-color gray"} onClick={this.changeGray}></button>  
                        <button className={(this.state.strokeColor==="rgba(100, 0, 0, 255)") ? "canvas-color darkRed buttonSelected" : "canvas-color darkRed"} onClick={this.changeDarkRed}></button>  
                        <button className={(this.state.strokeColor==="rgba(255, 127, 80, 255)") ? "canvas-color coral buttonSelected" : "canvas-color coral"} onClick={this.changeCoral}></button> 
                        <button className={(this.state.strokeColor==="rgba(218, 165, 32, 255)") ? "canvas-color goldenRod buttonSelected" : "canvas-color goldenRod"} onClick={this.changeGoldenRod}></button>  
                        <button className={(this.state.strokeColor==="rgba(0, 128, 0, 255)") ? "canvas-color green buttonSelected" : "canvas-color green"} onClick={this.changeGreen}></button> 
                        <button className={(this.state.strokeColor==="rgba(0, 0, 255, 255)") ? "canvas-color blue buttonSelected" : "canvas-color blue"} onClick={this.changeBlue}></button> 
                        <button className={(this.state.strokeColor==="rgba(75, 0, 130, 255)") ? "canvas-color indigo buttonSelected" : "canvas-color indigo"} onClick={this.changeIndigo}></button>  
                        <button className={(this.state.strokeColor==="rgba(0, 0, 128, 255)") ? "canvas-color navy buttonSelected" : "canvas-color navy"} onClick={this.changeNavy}></button>  
                        <button className={(this.state.strokeColor==="rgba(165, 42, 42, 255)") ? "canvas-color brown buttonSelected" : "canvas-color brown"} onClick={this.changeBrown}></button>  
                    </div>
                    <input className="sizeButton" value={this.state.strokeSize} onChange={this.changeStrokeSize}/>
                    <button className={(this.state.action==="drawing") ? "techButton pencil buttonSelected" : "techButton pencil"} title="Pencil" onClick={this.drawingAction}> </button>
                    <button className={(this.state.action==="filling") ? "techButton fill buttonSelected" : "techButton fill"} title="Filling" onClick={this.fillingAction}> </button>
                    <button className="techButton clear" title="Clear" onClick={this.clearAll}>  </button>
                    <button className="techButton undo" title="Undo" onClick={this.undoStroke}> </button>
                    <button className="techButton submit" title="Submit" onClick={this.promptSubmit}> </button>

                    <div className ="popUp">
                        <div className="popUpContent">
                            <div className="close" onClick={this.closePromptSubmit}> + </div>
                            <p>Are you sure you want to submit? If you submit your image will be cleared! </p>

                            <Link to="/feed/" className="submitDrawing" title="Submit" onClick={this.submitDrawing}>
                                <p>Submit!</p>
                            </Link>

                        </div>
                    </div>
                    
                    <button className="techButton download" title="Download" onClick={this.downloadDrawing}> </button>
                </div>
            </div>
        )
    }
}
export default Canvas;