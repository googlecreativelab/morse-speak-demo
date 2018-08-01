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

import React from 'react';
import * as $ from 'jquery';

// Styles
import './Input.css';

// Assets
import speakButton from '../assets/images/speak.png';
import clearButton from '../assets/images/clear.png';

export class Input extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentString: "",
      maxFontSize: 40,
      minFontSize: 20,
      lastString: ""
    }
  }

  updateString(value) {
    this.setState({lastString: value})
  }

  reset() {
    this.setState({currentString: ""})
    $(this.refs.input).val("")
    this.updateFontSize(true)
  }

  componentDidMount() {
    let maxHeight = $(this.refs.container).css('maxHeight');
    $(this.refs.input).css('height', maxHeight)
    $(this.refs.input).css('fontSize', this.state.maxFontSize)
  }

  onKeyUp(e) {
    if(e.keyCode === 229) {
      let value = $(this.refs.input).val()
      this.setState({currentString: value})
      let code = value.charCodeAt(value.length - 1)
      if (code === 61) this.reset()
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      document.getElementById("input").disabled = true;
      this.startActivation();
    } else {
      let value = $(this.refs.input).val()
      this.setState({currentString: value})
      this.updateFontSize(false);
    }
  }

  startActivation() {
    this.props.activateFeature(this.state.currentString, this.state.lastString)
    if ((this.state.currentString.trim())[0] !== ":" && this.props.isInEditMode === false) {
      this.setState({lastString: this.state.currentString})
    } else {
      this.reset();
      this.updateFontSize(true);
    }

  }

  skipProsign() {
    // In case the user just pasted in their content, set the currentString here
    let value = $(this.refs.input).val()
    this.setState({currentString: value})
    this.startActivation()
  }

  updateFontSize(reset) {
    let length = this.state.currentString.length;

    let newFontSize;
    if (reset) {
      newFontSize = this.state.maxFontSize
    } else {
      const size = this.state.maxFontSize - (length * .4)
      newFontSize = size >= this.state.minFontSize ? size : this.state.minFontSize
    }

    $(this.refs.input).css('fontSize', newFontSize + 'px')
  }

  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="input-field col s12" id="input-container" ref="container">
            <textarea autoFocus onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)} ref="input" id="input" type="textarea" placeholder="Type here"></textarea>
            <div id="controls">
                <img id="speak" src={speakButton} onTouchEnd={this.skipProsign.bind(this)} onClick={this.skipProsign.bind(this)} alt="Speak" />
                <img id="clear" src={clearButton} onTouchEnd={this.reset.bind(this)} onClick={this.reset.bind(this)} alt="Clear" />
            </div>
            <div dangerouslySetInnerHTML={{__html: this.props.placeholder}}></div>
          </div>
        </div>
      </div>
    )
  }
}
