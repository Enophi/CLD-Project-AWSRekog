import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

interface Props {
    imageData?: string,
    showAnimation: () => void,
    onProcessed: (infos: any) => void,
    rekog: AWS.Rekognition
}

class TextAnalysis extends React.Component<Props, any> {

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
            }
        };
        console.log(params)
        this.props.rekog.detectText(params, (err, resp) => {
            if (err) console.log(err.stack)
            else {
                this.props.onProcessed(resp)
            }
        });
    };

    render() {
        return <div>
            <FontAwesomeIcon icon={faFile} size='3x' className='icons-base-color' onClick={this.processImage}/>
            <p>Text</p>
            </div>
    }
}

export default TextAnalysis;