import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faImages } from '@fortawesome/free-solid-svg-icons'

interface Props {
    imageData?: string,
    showAnimation: () => void,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class ImageAnalysis extends React.Component<Props, any> {

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
        return <div>
            <FontAwesomeIcon icon={faImages} size='3x' className='icons-base-color' onClick={this.processImage}/>
            <p>Image</p>
            </div>
    }
}

export default ImageAnalysis;