import React from 'react';

interface Props {
    imageData?: string,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class CustomAnalysis extends React.Component<Props, any> {

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
            "MaxResults": 10,
            "MinConfidence": 70,
            "ProjectVersionArn": 'arn:aws:rekognition:us-east-1:598064129395:project/CLD-CustomLabels/version/CLD-CustomLabels.2020-06-11T18.26.18/1591892778581'
        };
        console.log(params)
        this.props.rekog.detectCustomLabels(params, (err, resp) => {
            if (err) console.log(err.stack)
            else {
                this.props.onProcessed(resp)
            }
        });
    };

    render() {
        return <button className="action-button nav" onClick={this.processImage}>Custom Analysis</button>
    }
}

export default CustomAnalysis;