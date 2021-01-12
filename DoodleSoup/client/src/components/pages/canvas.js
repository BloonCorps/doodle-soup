import React, { Component } from "react";
import "../../utilities.css";
import "./canvas.css"


//const rect = canvas.getBoundingClientRect() <-Fix for positioning
//https://stackoverflow.com/questions/53960651/how-to-make-an-undo-function-in-canvas <- Undo Button

class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawing : false,
            verticalShift : 108,
            horizontalShift : 12,
            strokeSize : 10,
            strokeColor : "Black",
            context : null,
        };
    };

    componentDidMount() {
        document.title = "Create!";
        let myCanvas = document.querySelector('.canvas');
        this.setState({context : myCanvas.getContext("2d")});

        myCanvas.width = window.innerWidth*0.75;
        myCanvas.height = window.innerHeight*0.75;

    };

    handleEvent = (event) => {
        if (event.type === "mousedown") {
            this.startDrawing(event);

        } else if (event.type === "mouseup") {
            this.setState({drawing: false});

        } else if (event.type === "mousemove") {
            this.drawing(event);
        }
    };

    drawing = (event) => {
        if (this.state.drawing === false) {
            return
        }
        this.state.context.lineWidth = this.state.strokeSize;
        this.state.context.strokeStyle = this.state.strokeColor;
        this.state.context.lineCap = "round";

        this.state.context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.stroke();
        this.state.context.beginPath();
        this.state.context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
    }

    startDrawing = (event) => {
        this.setState({drawing : true})

        this.state.context.lineWidth = this.state.strokeSize;
        this.state.context.strokeStyle = this.state.strokeColor;
        this.state.context.lineCap = "round";

        this.state.context.beginPath();
        this.state.context.moveTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.lineTo(event.clientX - this.state.horizontalShift, event.clientY - this.state.verticalShift);
        this.state.context.stroke();
    }

    endDrawing = () => {
        this.state.context.beginPath();
        this.setState({drawing : false});

    }

    changeStrokeSize = (event) => {
        this.setState({strokeSize : event.target.value})
    }

    changeStrokeColor = (event) => {
        this.setState({strokeColor : event.target.value})
    }

    render() {
        return (
            <div>
                <canvas className="canvas" onMouseDown={this.handleEvent} onMouseUp={this.handleEvent} onMouseMove={this.handleEvent}></canvas>
                <input className="strokeSize" value={this.state.strokeSize} onChange={this.changeStrokeSize}/>
                <input className="strokeColor" value={this.state.strokeColor} onChange={this.changeStrokeColor}/>
            </div>
        )
    }
}

export default Canvas;