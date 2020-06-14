import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCubes } from '@fortawesome/free-solid-svg-icons'

interface Props {
    imageData?: string,
    showAnimation: () => void,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class CustomAnalysis extends React.Component<Props, any> {

    processImage = () => {
        this.props.showAnimation()
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
        return <div>
            <FontAwesomeIcon icon={faCubes} size='3x' className='icons-base-color' onClick={this.processImage}/>
            <p>Custom</p>
            </div>
    }
}

export default CustomAnalysis;