import React from 'react';
import AWS from 'aws-sdk';
import ImageUploader from 'react-images-upload';

import './Features.css';
import CanvasComp from '../canvas/CanvasComp';

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
            <div>
                <div className="container">
                    <ImageUploader
                        withIcon={false}
                        buttonText='Sélectionnez une image'
                        onChange={this.onDrop}
                        imgExtension={['.jpg|.png']}
                        singleImage={true}
                        maxFileSize={5242880}
                    />
                    <div className="item">
                        <CanvasComp
                            imageURL={this.state.imageURL}
                            w={this.state.image?.width}
                            h={this.state.image?.height}
                            rekog={this.state.rekog} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Features;