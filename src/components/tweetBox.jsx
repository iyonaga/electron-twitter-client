import React, { PureComponent } from 'react';
import { Picker } from 'emoji-mart';
import twitterText from 'twitter-text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faGrinAlt } from '@fortawesome/free-regular-svg-icons';
import styles from './tweetBox.module.scss';
import { createTwitterClient } from '../utils/twitterClient';

export default class TweetBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTweetable: false,
      isOpenPicker: false,
      images: []
    };
    this.onChangeText = ::this.onChangeText;
    this.onSelectImage = ::this.onSelectImage;
    this.onRemoveImage = ::this.onRemoveImage;
    this.onTogglePicker = ::this.onTogglePicker;
    this.onClosePicker = ::this.onClosePicker;
    this.onSelectEmoji = ::this.onSelectEmoji;
    this.onPostTweet = ::this.onPostTweet;
  }

  componentDidMount() {
    this.textArea.focus();
    document.addEventListener('click', this.onClosePicker);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClosePicker);
  }

  onChangeText() {
    const text = this.textArea.value;
    const result = twitterText.parseTweet(text);
    // const progress = result.permillage / 10;
    // let progressBarRightStyle;
    // let progressBarLeftStyle;
    //
    // if (progress > 100) {
    //   progressBarRightStyle = `border-color: #bf3131; transform: rotate(180deg);`;
    //   progressBarLeftStyle = progressBarRightStyle;
    // } else if (progress > 50) {
    //   const deg = (progress - 50) * (180 / 50);
    //   progressBarRightStyle = `border-color: #1ca1f3; transform: rotate(180deg);`;
    //   progressBarLeftStyle = `border-color: #1ca1f3; transform: rotate(${deg}deg);`;
    // } else {
    //   const deg = progress * (180 / 50);
    //   progressBarRightStyle = `border-color: #1ca1f3; transform: rotate(${deg}deg);`;
    //   progressBarLeftStyle = `border-color: #1ca1f3; transform: rotate(0deg);`;
    // }
    //
    // this.progressBarRight.style = progressBarRightStyle;
    // this.progressBarLeft.style = progressBarLeftStyle;

    this.setState({
      isTweetable: result.valid
    });
  }

  onSelectImage(e) {
    for (let i = 0; i < e.target.files.length; i += 1) {
      const file = e.target.files[i];
      const reader = new FileReader();
      reader.onload = res => {
        this.setState({
          images: this.state.images.concat([res.target.result])
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onRemoveImage(image) {
    const images = this.state.images.filter(el => el !== image);
    this.setState({
      images
    });
  }

  onTogglePicker() {
    this.setState({
      isOpenPicker: !this.state.isOpenPicker
    });
  }

  onClosePicker(e) {
    if (this.toggleButton.contains(e.target)) {
      return;
    }

    if (!this.picker || !this.picker.contains(e.target)) {
      this.setState({
        isOpenPicker: false
      });
    }
  }

  onSelectEmoji(res) {
    const text = this.textArea.value;
    const cursorPos = this.textArea.selectionStart;
    const before = text.substr(0, cursorPos);
    const after = text.substr(cursorPos);
    this.textArea.value = `${before}${res.native}${after}`;
    this.textArea.selectionStart = cursorPos + res.native.length;
  }

  onPostTweet() {
    const text = this.textArea.value;

    createTwitterClient()
      .then(client => {
        const mediaIdStrArr = [];
        const promises = [];

        if (this.state.images.length === 0) {
          return [client, { status: text }];
        }

        for (let i = 0; i < this.state.images.length; i += 1) {
          const image = this.state.images[i];
          const b64Data = image.substr(image.indexOf(',') + 1);

          promises.push(client.uploadMedia({ media: b64Data }));
        }

        return Promise.all(promises).then(res => {
          res.map(data => mediaIdStrArr.push(data.media_id_string));

          return [
            client,
            {
              status: text,
              media_ids: mediaIdStrArr
            }
          ];
        });
      })
      .then(res => {
        const client = res[0];
        const params = res[1];

        client.postTweet(params).then(() => {
          this.setState({ images: [] });
          this.textArea.value = '';
        });
      });
  }

  render() {
    return (
      <div className={styles.container}>
        <textarea
          ref={c => {
            this.textArea = c;
          }}
          className={styles.textbox}
          onChange={this.onChangeText}
          placeholder="What’s happening?"
        />
        {/* <div className={styles.progress}>
          <div className={styles.progressRight}>
            <span
              className={styles.progressBar}
              ref={c => {
                this.progressBarRight = c;
              }}
            />
          </div>
          <div className={styles.progressLeft}>
            <span
              className={styles.progressBar}
              ref={c => {
                this.progressBarLeft = c;
              }}
            />
          </div>
        </div> */}
        <div className={styles.thumbnailContainer}>
          <div className={styles.thumbnailList}>
            {this.state.images.map(image => (
              <div className={styles.thumbnailItem} key={image}>
                <div className={styles.imageContainer}>
                  <img src={image} alt="" />
                </div>
                <button
                  className={styles.removeIcon}
                  onClick={() => this.onRemoveImage(image)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.options}>
            <div className={styles.imageSelector}>
              <input
                id="imageSelector"
                type="file"
                onChange={e => {
                  this.onSelectImage(e);
                }}
                accept="image/jpeg,image/jpg,image/png"
                hidden
                multiple
                disabled={this.state.images.length >= 4}
              />
              <label htmlFor="imageSelector">
                <FontAwesomeIcon icon={faImage} />
              </label>
            </div>
            <div className={styles.emojiPicker}>
              <button
                ref={c => {
                  this.toggleButton = c;
                }}
                className={styles.toggleButton}
                onClick={this.onTogglePicker}
              >
                <FontAwesomeIcon icon={faGrinAlt} />
              </button>
              {this.state.isOpenPicker && (
                <div
                  ref={c => {
                    this.picker = c;
                  }}
                >
                  <Picker
                    emojiSize={18}
                    set="twitter"
                    showPreview={false}
                    onSelect={this.onSelectEmoji}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            className={styles.tweetButton}
            onClick={this.onPostTweet}
            disabled={!this.state.isTweetable}
          >
            Tweet
          </button>
        </div>
      </div>
    );
  }
}
