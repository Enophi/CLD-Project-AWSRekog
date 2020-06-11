import React, { createRef } from 'react';
import FaceAnalysis from '../face-analysis/FaceAnalysis'
import ImageAnalysis from '../image-analysis/ImageAnalysis'
import CustomAnalysis from '../custom-analysis/CustomAnalysis'
import ReactJson from 'react-json-view'

import './CanvasComp.css';

interface State {
    w: number,
    h: number,
    rekog: AWS.Rekognition,
    imageData?: string,
    rawData?: any
}

class CanvasComp extends React.Component<any, State> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    
    constructor(props: any) {
        super(props)
        this.state = {
            w: 0,
            h: 0,
            rekog: this.props.rekog
        }

        this.canvasRef = createRef()
        this.updateImage = this.updateImage.bind(this);
        this.onImageProcessed = this.onImageProcessed.bind(this)
        this.onFaceProcessed = this.onFaceProcessed.bind(this)
        this.onCustomProcessed = this.onCustomProcessed.bind(this)
    }

    componentWillReceiveProps(someProps: any) {
        this.setState({
            w: someProps.w,
            h: someProps.h
        });
        this.updateImage(someProps.imageURL)
    }

    updateImage(imageURL: string) {
        console.log(imageURL)

        const canvas = this.canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const img = new Image;
        img.src = imageURL;
        img.onload = () => {
            ctx?.clearRect(0, 0, img.width, img.height)
            ctx?.drawImage(img, 0, 0);
            this.setState({
                imageData: canvas?.toDataURL()
            });
        }
    }

    onImageProcessed(infos: any) {
        this.setState({
            rawData: infos
        });
        for (let lab of infos.Labels) {
            for (let bb of lab.Instances) {

                this.drawTag(
                    lab.Name,
                    bb.BoundingBox.Left,
                    bb.BoundingBox.Top,
                    bb.BoundingBox.Width,
                    bb.BoundingBox.Height,
                )
            }
        }
    }

    onFaceProcessed(infos: any) {
        this.setState({
            rawData: infos
        });
        for (let face of infos.FaceDetails) {

            this.drawTag(
                face.Gender.Value,
                face.BoundingBox.Left,
                face.BoundingBox.Top,
                face.BoundingBox.Width,
                face.BoundingBox.Height,
                '#00FF00'
            );

            for (let lm of face.Landmarks) {
                console.log(lm)
                this.drawMark(
                    lm.Type,
                    lm.X,
                    lm.Y
                );
            }
        }
    }

    onCustomProcessed(infos: any) {
        console.log(infos);
    }

    drawMark(label: string, x: number, y: number, color: string = '#0000FF') {
        const canvas = this.canvasRef?.current;
        const ctx = canvas?.getContext('2d');
        ctx!.font = '10px JetBrains Mono';
        ctx!.fillStyle = color;
        ctx!.fillRect(this.state.w * x, this.state.h * y, 5, 5);
    }

    drawTag(label: string, x: number, y: number, w: number, h: number, color: string = '#FF0000', lineWidth: number = 4) {
        const canvas = this.canvasRef?.current;
        const ctx = canvas?.getContext('2d');
        ctx!.font = '20px JetBrains Mono';
        ctx!.fillStyle = color;
        ctx!.strokeStyle = color;
        ctx!.lineWidth = lineWidth;
        ctx!.strokeRect(this.state.w * x, this.state.h * y, this.state.w * w, this.state.h * h);

        let yPos = this.state.h * y - 5;
        let xPos = this.state.w * x + 10
        if (yPos <= 30)
            yPos += 20

        ctx!.fillText(label, xPos, yPos)
    }

    render() {
        return (
            <div>
                <div className="buttons">
                    <FaceAnalysis
                        imageData={this.state.imageData}
                        onProcessed={this.onFaceProcessed}
                        rekog={this.state.rekog}
                    />
                    <ImageAnalysis
                        imageData={this.state.imageData}
                        onProcessed={this.onImageProcessed}
                        rekog={this.state.rekog}
                    />
                    <CustomAnalysis
                        imageData={this.state.imageData}
                        onProcessed={this.onCustomProcessed}
                        rekog={this.state.rekog}
                    />
                </div>
                <div className="results">
                    <div className="item json">
                        <ReactJson src={this.state.rawData} theme="monokai" enableClipboard={false} />
                    </div>
                    <div className='item-2'>
                        <canvas ref={this.canvasRef} width={this.state.w} height={this.state.h}></canvas>
                    </div>
                </div>
            </div>

        )
    }

}

export default CanvasComp;