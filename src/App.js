import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from './components/Gallery';
import CheckButton from './components/CheckButton';
import Modal from "react-responsive-modal";
import prepareArray from './helpers/prepareArray';
import data from './data/index.json';
import { Progress } from 'react-sweet-progress';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import "react-sweet-progress/lib/style.css";
import 'react-notifications/lib/notifications.css';

import './App.css';

export default class App extends React.Component {
    constructor(props){
        super(props);      
        const storageImages = JSON.parse(localStorage.getItem('images'));
        this.state = {
            images: storageImages.length ? storageImages : [],
            selectAllChecked: false,
            open: false,
            percent: 0
        };

        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
        this.onClickSelectAll = this.onClickSelectAll.bind(this);        
        this.onRemoveImages = this.onRemoveImages.bind(this);        
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    onEntered = () => {        
        setTimeout(() => {
            let image = {};
            let images = [];
            for(var i = 0; i < this.state.images.length; i++) {
                image = this.state.images[i];
                if(this.state.images[i].isSelected == true){
                    image.percent = this.getRandomInt(1, 40);
                }
                images.push(image);
            }
            this.setState({ images: images});
        }, 500)

        setTimeout(() => {
            let image = {};
            let images = [];
            for(var i = 0; i < this.state.images.length; i++) {
                image = this.state.images[i];
                if(this.state.images[i].isSelected == true){
                    image.percent = this.getRandomInt(40, 70);
                }
                images.push(image);
            }
            this.setState({ images: images});
        }, 1000)

        setTimeout(() => {
            this.setState({ percent: 100});
        }, 1500)
    }

    onOpenModal = () => {
        const selected = this.getSelectedImages();
        if(selected.length) {
            this.setState({ open: true, percent: 0});
        } else {
            NotificationManager.warning('', 'You have to select at least 1 image.', 3000);
        }
      
    };

    onCloseModal = () => {
        let image = {};
        let images = [];
        for(var i = 0; i < this.state.images.length; i++) {
            image = this.state.images[i];
            image.percent = 0;
            images.push(image);
        }
        this.setState({ images: images});
        this.setState({ images, open: false, percent: 0 });
    };


    allImagesSelected (images){
        var f = images.filter(
            function (img) {
                return img.isSelected == true;
            }
        );
        return f.length == images.length;
    }

    onSelectImage (index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });

        if(this.allImagesSelected(images)){
            this.setState({
                selectAllChecked: true
            });
        }
        else {
            this.setState({
                selectAllChecked: false
            });
        }
    }

    getSelectedImages () {
        var selected = [];
        for(var i = 0; i < this.state.images.length; i++)
            if(this.state.images[i].isSelected == true)
                selected.push(i);
        return selected;
    }

    onClickSelectAll () {
        var selectAllChecked = !this.state.selectAllChecked;
        this.setState({
            selectAllChecked: selectAllChecked
        });

        var images = this.state.images.slice();
        if(selectAllChecked){
            for(var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = true;
        }
        else {
            for(var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = false;

        }
        this.setState({
            images: images
        });
    }

    onRemoveImages () {
        const leftImages = [];
        const removeImages = [];

        for(var i = 0; i < this.state.images.length; i++) {
            if(this.state.images[i].isSelected == true) {
               removeImages.push(i);
            } else {
               leftImages.push(this.state.images[i]); 
            }
        }

        this.setState({
            images: leftImages
        }, () => {
            localStorage.setItem('images', JSON.stringify(leftImages));
            this.onCloseModal();  
            NotificationManager.success('', 'Images: ' + removeImages.toString() + ' have been deleted.');
        })
        
    }

    onResetImages = () => {
        const prepatedArray = prepareArray(data.imageURLs, data.title);
        localStorage.setItem('images', JSON.stringify(prepatedArray));
        this.setState({
            images: prepatedArray,
            selectAllChecked: false,
            open: false,
            percent: 0
        });
    }

    render () {
        const { open, percent, images } = this.state;
        const items = [];
        return (
                images.length ?
                <div>
                    <Modal open={open} onClose={this.onCloseModal} onEntered={this.onEntered} classNames={{'modal': 'modal-main'}} center>
                      <h2>Delete selected images?</h2>
                      <div className="modal-content">
                            {images.map((image, key) => 
                                image.isSelected ?                              
                                    <div className="item" key={key}>
                                        <div className="item-image">
                                            <img src={image.thumbnailSmall}/>
                                        </div>
                                        <div className="item-load">
                                            <Progress percent={percent == 100 ? percent : image.percent} status="error" />
                                        </div>       
                                    </div>
                                :null
                            )}
                      </div>  
                      <div className="modal-footer">
                            <div className="button-container">
                              <a href="#" onClick={this.onRemoveImages} className="btn blue-btn"><span><i className="far fa-check-circle custom-icon"></i>Sure</span></a>
                              <a href="#" onClick={this.onCloseModal} className="btn white-btn"><span><i className="fas fa-ban custom-icon"></i>Nope</span></a>
                            </div>
                      </div>  
                    </Modal>

                    <div className="controller-container">
                        <div className="parts">
                            <CheckButton
                                index={0}
                                isSelected={this.state.selectAllChecked}
                                onClick={this.onClickSelectAll}
                                parentHover={true}
                                color={"rgba(0,0,0,0.54)"}
                                selectedColor={"#4285f4"}
                                hoverColor={"rgba(0,0,0,0.54)"}/>
                            <div className="select_all" onClick={this.onClickSelectAll}>Select All</div>
                        </div>
                        <div className="button-container parts">
                          <a href="#" onClick={this.onOpenModal} className="btn blue-btn"><span><i className="fas fa-trash-alt custom-icon"></i>Delete Images</span></a>
                        </div>
                    </div>
                    

                    <div className="selected_images">Selected Images: {this.getSelectedImages().toString()}</div>
                    <div className="gallery_wrapper">
                        <Gallery
                            images={this.state.images}
                            onSelectImage={this.onSelectImage}
                            showLightboxThumbnails={true}/>
                    </div>
                    <NotificationContainer/>
                </div>
                : 
                <div>
                    <div className="button-container text-center">
                        <a href="#" onClick={this.onResetImages} className="btn blue-btn"><span><i className="fas fa-redo-alt custom-icon"></i>Reset Images</span></a>
                    </div>
                    <NotificationContainer/>
                </div>
        );
    }
}

App.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            srcset: PropTypes.array,
            caption: PropTypes.string,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
            isSelected: PropTypes.bool
        })
    ).isRequired
};

App.defaultProps = {
    images: prepareArray(data.imageURLs, data.title)
};
