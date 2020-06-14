import React from 'react';
import AWS from 'aws-sdk';
import ImageUploader from 'react-images-upload';

import './Features.css';
import CanvasComp from '../canvas/CanvasComp';
import logo from '../../img/aws-rekognition.png'

interface State {
    image?: HTMLImageElement,
    imageURL?: string,
    rekog?: AWS.Rekognition
}

class Features extends React.Component<any, State> {

    constructor(props: any) {
        super(props)
    }

    componentWillMount() {
        this.AnonymousLog()
        this.setState({
            rekog: new AWS.Rekognition()
        })
    }

    AnonymousLog() {
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:cfde00cb-c4ec-4b0a-9369-ab2172c1774a',
        });
        AWS.config.getCredentials(err => {
            if (err) console.log(err.stack)
        });
    }

    onDrop = (picture: File[]) => {
        let url = URL.createObjectURL(picture[0]);
        let img = new Image;
        img.onload = () => {
            this.setState({
                imageURL: url,
                image: img
            });
        };
        img.src = url
    };

    render() {
        return (
            <div className="body-content">
                <div className="d-flex flex-row justify-content-between" style={{margin:10}}>
                    <div className="col-3">
                        <img src={logo} alt="Logo" />
                    </div>

                    <ImageUploader
                        withIcon={true}
                        buttonText='Sélectionnez une image'
                        buttonClassName="image-upload"
                        buttonStyles={{ backgroundColor: "#429ef5" }}
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.png']}
                        label="La taille maximale de l'image 5Mb, extensions acceptés .jpg, .png"
                        singleImage={true}
                        maxFileSize={5242880}
                    />
                    <div className="col-3">

                    </div>
                </div>

                <div>
                    <CanvasComp
                        imageURL={this.state.imageURL}
                        w={this.state.image?.width}
                        h={this.state.image?.height}
                        rekog={this.state.rekog} />
                </div>
            </div>
        )
    }
}

export default Features;