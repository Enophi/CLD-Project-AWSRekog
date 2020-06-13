import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

interface Props {
    imageData?: string,
    showAnimation: () => void,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class FaceAnalysis extends React.Component<Props, any> {

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
            Attributes: ['ALL']
        };
        console.log(params)
        this.props.rekog.detectFaces(params, (err, resp) => {
            if (err) console.log(err.stack)
            else {
                this.props.onProcessed(resp)
            }
        });
    };

    render() {
        return <div>
            <FontAwesomeIcon icon={faUsers} size='3x' className='icons-base-color' onClick={this.processImage}/>
            <p>Face</p>
            </div>
    }
}

export default FaceAnalysis;