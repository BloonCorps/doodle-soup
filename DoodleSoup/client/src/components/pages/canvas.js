import React, { Component } from "react";
import "../../utilities.css";
import "./canvas.css"


//const rect = canvas.getBoundingClientRect() <-Fix for positioning
//https://stackoverflow.com/questions/53960651/how-to-make-an-undo-function-in-canvas <- Undo Button
const RADIUSSHIFT = 10;
class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawing : false,
            verticalShift : 0,
            horizontalShift : 0,
            strokeSize : 10,
            strokeColor : "Black",
            context : null,
            strokePaths : [],
            tempPoints : [],
        };
    };

    componentDidMount() {
        document.title = "Create!";
        let myCanvas = document.querySelector('.canvas');
        this.setState({context : myCanvas.getContext("2d")});

        myCanvas.width = 1000;
        myCanvas.height = 600;

        this.setState({verticalShift : myCanvas.getBoundingClientRect().top + RADIUSSHIFT});
        this.setState({horizontalShift : myCanvas.getBoundingClientRect().left + RADIUSSHIFT});

        window.addEventListener("resize", this.recalibrate);
    };

    recalibrate = () => {
        let myCanvas = document.querySelector('.canvas');
        this.setState({verticalShift : myCanvas.getBoundingClientRect().top + RADIUSSHIFT});
        this.setState({horizontalShift : myCanvas.getBoundingClientRect().left + RADIUSSHIFT});
    }

    handleEvent = (event) => {
        if (event.type === "mousedown") {
            this.startDrawing(event);

        } else if (event.type === "mouseup") {
            this.endDrawing();

        } else if (event.type === "mousemove") {
            this.drawing(event);
        }
    };

    drawing = (event) => {
        if (this.state.drawing === false) {
            return
        }

        //Formatting
        this.state.context.lineWidth = this.state.strokeSize;
        this.state.context.strokeStyle = this.state.strokeColor;
        this.state.context.lineCap = "round";

        //Draw
        this.state.context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.stroke();
        this.state.context.beginPath();
        this.state.context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);

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
        this.state.context.lineWidth = this.state.strokeSize;
        this.state.context.strokeStyle = this.state.strokeColor;
        this.state.context.lineCap = "round";

        //Make Dots
        this.state.context.beginPath();
        this.state.context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.stroke();

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
        this.state.context.beginPath();
        this.setState({drawing : false});

        let temp = [...this.state.strokePaths]
        temp.push([...this.state.tempPoints]);
        this.setState({strokePaths : temp});
        this.setState({tempPoints : []});
    }

    clearAll = () => {
        let myCanvas = document.querySelector('.canvas');
        this.state.context.clearRect(0, 0, myCanvas.width, myCanvas.height);
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
        let myCanvas = document.querySelector('.canvas');
        this.state.context.clearRect(0, 0, myCanvas.width, myCanvas.height);

        this.recreatePaths()
        let temp = [...this.state.strokePaths]
        temp.pop()
        this.setState({strokePaths : temp})
    }

    recreatePaths = () => {
        // draw all the paths in the paths array
        for(let stroke = 0; stroke < this.state.strokePaths.length - 1; stroke++) {

            //Formatting
            this.state.context.lineWidth = this.state.strokePaths[stroke][0].size;
            this.state.context.strokeStyle = this.state.strokePaths[stroke][0].color;
            this.state.context.lineCap = "round";

            //Make Dots
            this.state.context.beginPath();
            this.state.context.moveTo(this.state.strokePaths[stroke][0].x - this.state.horizontalShift, this.state.strokePaths[stroke][0].y - this.state.verticalShift);
            this.state.context.lineTo(this.state.strokePaths[stroke][0].x - this.state.horizontalShift, this.state.strokePaths[stroke][0].y - this.state.verticalShift);
            this.state.context.stroke();

            for(let coor = 1; coor < this.state.strokePaths[stroke].length; coor++) {
                //Draw
                this.state.context.lineTo(this.state.strokePaths[stroke][coor].x - this.state.horizontalShift, this.state.strokePaths[stroke][coor].y - this.state.verticalShift);
                this.state.context.stroke();
                this.state.context.beginPath();
                this.state.context.moveTo(this.state.strokePaths[stroke][coor].x - this.state.horizontalShift, this.state.strokePaths[stroke][coor].y - this.state.verticalShift);
            };
            this.state.context.beginPath();
        };
    }  

    changeRed = () => {
        this.setState(
            {strokeColor : "red"}
        )
    }
    changeOrange = () => {
        this.setState(
            {strokeColor : "orange"}
        )
    }
    changeYellow = () => {
        this.setState(
            {strokeColor : "yellow"}
        )
    }
    changeGreen = () => {
        this.setState(
            {strokeColor : "green"}
        )
    }
    changeBlue = () => {
        this.setState(
            {strokeColor : "blue"}
        )
    }
    changePurple = () => {
        this.setState(
            {strokeColor : "purple"}
        )
    }
    changePink = () => {
        this.setState(
            {strokeColor : "pink"}
        )
    }
    changeBrown = () => {
        this.setState(
            {strokeColor : "brown"}
        )
    }
    changeBlack = () => {
        this.setState(
            {strokeColor : "black"}
        )
    }
    changeGrey = () => {
        this.setState(
            {strokeColor : "grey"}
        )
    }
    changeWhite = () => {
        this.setState(
            {strokeColor : "white"}
        )
    }

    render() {
        return (
            <div>
                <canvas className="canvas" onMouseDown={this.handleEvent} onMouseUp={this.handleEvent} onMouseMove={this.handleEvent}></canvas>
                <input className="strokeSize" value={this.state.strokeSize} onChange={this.changeStrokeSize}/>
                <button className="color red" onClick={this.changeRed}></button>  
                <button className="color orange" onClick={this.changeOrange}></button>  
                <button className="color yellow" onClick={this.changeYellow}></button>  
                <button className="color green" onClick={this.changeGreen}></button>  
                <button className="color blue" onClick={this.changeBlue}></button>  
                <button className="color purple" onClick={this.changePurple}></button>  
                <button className="color pink" onClick={this.changePink}></button>  
                <button className="color brown" onClick={this.changeBrown}></button>  
                <button className="color black" onClick={this.changeBlack}></button>  
                <button className="color grey" onClick={this.changeGrey}></button>  
                <button className="color white" onClick={this.changeWhite}></button>  
                <button className="clearButton" onClick={this.clearAll}> Clear </button>
                <button className="submitButton" onClick={this.submitDrawing}> Submit </button>
                <button className="undoButton" onClick={this.undoStroke}> Undo </button>
            </div>
        )
    }
}

export default Canvas;