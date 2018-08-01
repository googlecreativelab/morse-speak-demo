// Copyright 2018 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { Component } from 'react';
import { AppContainer } from '../AppContainer/AppContainer';
import './App.css';

import question from '../assets/images/question.png';
import back from '../assets/images/back.png';
import logo from '../assets/images/logo.png';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bypassDeviceBlock: false,
      aboutVisible: window.location.hash === '#about'
    }
  }

  bypass() {
    this.setState({bypassDeviceBlock: true})
  }

  toggleAbout() {
    this.setState({aboutVisible: !this.state.aboutVisible}, () => {
      if (this.state.aboutVisible) window.location.hash = 'about'
      else window.location.hash = ''
    })
  }

  render() {
    const isAndroid = /android/i.test(navigator.userAgent)
    const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
    const aboutIcon = this.state.aboutVisible ? back : question
    const title = this.state.aboutVisible ? 'About' : 'Morse Text-to-Speech Demo'
    return (
      <div>
        <div className="header"><a className="icon" href="javascript:void(0);" onClick={this.toggleAbout.bind(this)}><img src={aboutIcon} alt="About toggle"/></a>{title}</div>
        {this.state.aboutVisible &&
          <div className="about overlay">
            <div className="about-content">
              <p>This is a text-to-speech (TTS) demo web app that converts written text into spoken word, which people can activate by inputting a unique Morse code sequence.</p>
              <p>It’s designed to work in tandem with Morse code on Gboard. <a href="https://support.google.com/accessibility/android/answer/9011881" target="_blank">Get the keyboard here.</a></p>
              <p>This experiment uses Google’s ML-powered <a href="https://cloud.google.com/text-to-speech/" target="_blank">Cloud Text-to-Speech API</a> which enables developers to synthesize natural-sounding speech with many voice options. The API uses WaveNet which incorporates DeepMind’s Machine Learning research.</p>
              <p>This experiment is part of a larger project to support Morse code for more accessible communication. <a href="http://morse.withgoogle.com/" target="_blank">Learn more at g.co/morse.</a></p>
            </div>
          </div>
        }
        <div className="orientation-block overlay">Please rotate back<br/>to portrait mode.</div>
        {isAndroid || this.state.bypassDeviceBlock ? (
          <AppContainer/>
        ) : (
          <div className="device-block">
            <div className="device-block-inner">
              <div className="logo">
                <img src={logo} alt="Morse Text to Speech"/>
              </div>
              <div className="title">Sorry, this experiment is for Morse on Gboard and is only available on Android at this time.</div>
              {isIOS &&
                <div>
                  <div className="disclaimer"><a className="button" href="javascript:void(0)" onClick={this.bypass.bind(this)}>Show me anyway</a></div>
                  <div className="disclaimer-text">(things may not work as expected)</div>
                </div>
              }
              <div className="cta"><a className="button" href="https://github.com/googlecreativelab/morse-speak-demo" target="_blank">Learn more and get the source code</a></div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
