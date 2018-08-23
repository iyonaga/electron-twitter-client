import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Player, BigPlayButton } from 'video-react';
import Modal from './modal';
import styles from './tweetMedia.module.scss';

export default class Tweet extends PureComponent {
  static propTypes = {
    tweet: PropTypes.object.isRequired
  };

  static renderVideo(video, thumbnail) {
    return (
      <div className={styles.videoContainer}>
        <Player muted poster={thumbnail} src={video.variants[0].url}>
          <BigPlayButton position="center" />
        </Player>
      </div>
    );
  }

  constructor(props) {
    super(props);
    const images = this.props.tweet.extended_entities
      ? this.props.tweet.extended_entities.media.map(m => m.media_url)
      : [];

    this.state = {
      isModalOpen: false,
      activeSlideIndex: null,
      images
    };

    this.onKeyDown = ::this.onKeyDown;
    this.onImageClick = ::this.onImageClick;
    this.slideNext = ::this.slideNext;
    this.slidePrev = ::this.slidePrev;
    this.closeModal = ::this.closeModal;
  }

  onKeyDown(e) {
    if (e.key === 'ArrowRight') {
      this.slideNext();
    } else if (e.key === 'ArrowLeft') {
      this.slidePrev();
    }
  }

  onImageClick(e) {
    const activeSlideIndex = e.target.getAttribute('data-slideindex');
    this.setState(
      {
        isModalOpen: true,
        activeSlideIndex: parseInt(activeSlideIndex, 10)
      },
      () => {
        document.addEventListener('keydown', this.onKeyDown, false);
      }
    );
  }

  slideNext() {
    const activeSlideIndex =
      this.state.activeSlideIndex + 1 < this.state.images.length
        ? this.state.activeSlideIndex + 1
        : 0;

    this.setState({
      activeSlideIndex
    });
  }

  slidePrev() {
    const activeSlideIndex =
      this.state.activeSlideIndex - 1 < 0
        ? this.state.images.length - 1
        : this.state.activeSlideIndex - 1;

    this.setState({
      activeSlideIndex
    });
  }

  closeModal() {
    document.removeEventListener('keydown', this.onKeyDown);
    this.setState({
      isModalOpen: false
    });
  }

  renderMedia(tweet) {
    if (!tweet.extended_entities) return false;
    const entities = tweet.extended_entities;

    return (
      <div className={styles.mediaContainer}>
        {(() => {
          if (entities.media[0].video_info) {
            return Tweet.renderVideo(
              entities.media[0].video_info,
              entities.media[0].media_url_https
            );
          }
          return this.renderImages(entities);
        })()}
      </div>
    );
  }

  renderImages(entities) {
    const isMultiple = entities.media.length > 1;
    const numList = ['single', 'double', 'triple', 'quad'];
    const imageNum = numList[entities.media.length - 1];

    return (
      <div
        className={`${styles.imageContainer} ${
          styles[`imageContainer--${imageNum}`]
        } ${isMultiple ? styles.multipleImages : ''}`}
      >
        <div className={styles.imageContents}>
          {this.renderFirstImage(entities.media[0].media_url)}
        </div>
        {isMultiple && (
          <div className={`${styles.imageContents}`}>
            {this.renderRemainingImage(entities.media)}
          </div>
        )}
      </div>
    );
  }

  renderFirstImage(url) {
    return (
      <div className={styles.imageItem}>
        <img src={url} alt="" data-slideindex="0" onClick={this.onImageClick} />
      </div>
    );
  }

  renderRemainingImage(media) {
    const remain = media.slice(1 - media.length);
    return remain.map((m, index) => (
      <div className={styles.imageItem} key={m.id_str}>
        <img
          src={m.media_url}
          alt=""
          data-slideindex={index + 1}
          onClick={this.onImageClick}
        />
      </div>
    ));
  }

  render() {
    return (
      <Fragment>
        {this.renderMedia(this.props.tweet)}
        {this.state.isModalOpen && (
          <Modal closeModal={this.closeModal}>
            <div
              className={`${styles.slideContainer} ${
                this.state.images.length > 1 ? 'hasSlideButton' : ''
              }`}
            >
              <div className={styles.slideWrapper}>
                {this.state.images.map((image, index) => (
                  <img
                    className={`${styles.slideItem} ${
                      this.state.activeSlideIndex === index ? 'isActive' : ''
                    }`}
                    src={image}
                    key={image}
                    alt=""
                  />
                ))}
              </div>
              {this.state.images.length > 1 && (
                <Fragment>
                  <button
                    className={`${styles.slideButton} ${
                      styles['slideButton--right']
                    }`}
                    onClick={this.slideNext}
                  />
                  <button
                    className={`${styles.slideButton} ${
                      styles['slideButton--left']
                    }`}
                    onClick={this.slidePrev}
                  />
                </Fragment>
              )}
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
}
