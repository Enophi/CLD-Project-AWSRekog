import React from 'react';

interface Props {
    imageData?: string,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class ImageAnalysis extends React.Component<Props, any> {

    processImage = () => {
        let image = atob(this.props.imageData!.split('data:image/png;base64,')[1])
        let bytes = new Uint8Array(new ArrayBuffer(image.length))
        for (var i = 0; i < image.length; i++) {
            bytes[i] = image.charCodeAt(i)
        }
        let params = {
            Image: {
                Bytes: bytes
            },
            "MaxLabels": 10,
            "MinConfidence": 70
        };
        console.log(params)
        this.props.rekog.detectLabels(params, (err, resp) => {
            if (err) console.log(err.stack)
            else {
                this.props.onProcessed(resp)
            }
        });
    };

    render() {
        return <button className="action-button nav" onClick={this.processImage}>Image Analysis</button>
    }
}

export default ImageAnalysis;