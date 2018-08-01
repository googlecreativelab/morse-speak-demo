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
import { Input } from '../Input/Input';

// Assets
import { answers } from '../assets/data/answers';
import './AppContainer.css';

// Global vars
let snd;

export class AppContainer extends React.Component {
  constructor(props) {
    let voice = localStorage.getItem('voice');
    let audioConfig = localStorage.getItem('audioConfig');
    
    super(props);

    if (voice === "undefined" || audioConfig === null) {
      voice = {
          'languageCode':'en-us',
          'name':'en-US-Wavenet-C',
          'ssmlGender':'FEMALE'
      }
    } else {
      voice = JSON.parse(voice)
    }

    if (audioConfig === "undefined" || audioConfig === null) {
      audioConfig = {
        audioEncoding: "MP3",
        speakingRate: 1,
        pitch: 0
      }
    } else {
      audioConfig = JSON.parse(audioConfig)
    }

    this.state = {
      currentVoice: voice,
      audioConfig: audioConfig,
      prosigns: {
        ':cg': {
          name: 'gender',
          function: this.changeVoiceGender.bind(this),
          set: this.setVoiceGender.bind(this),
          placeholder: 'Choose a gender: <br/>',
        },
        ':cl': {
          name: 'locale',
          function: this.changeVoiceLocale.bind(this),
          set: this.setVoiceLocale.bind(this),
          placeholder: 'Choose a voice locale: <br/>'
        },
        ':cd': {
          name: 'detail',
          function: this.changeVoiceDetail.bind(this),
          set: this.setVoiceDetail.bind(this),
          placeholder: 'Choose a version: <br/>'
        },
        ':cp': {
          name: 'pitch',
          function: this.changeVoicePitch.bind(this),
          set: this.setVoicePitch.bind(this),
          placeholder: 'Choose a speed'
        }
      },
      isInEditMode: false,
      which: '',
    }

    this.child = React.createRef();
  }

  componentDidMount() {
    this.grabVoiceData();
  }

  changeVoicePitch() {
    this.triggerSpeech("Changing voice pitch")
    this.setState({
      isInEditMode: true,
      which: ':cp'
    })
  }

  setVoicePitch(answer) {
    console.log("setting voice pitch")
    let currentConfig = this.state.audioConfig;
    let answerNum = parseInt(answer, 10);
    if (isNaN(answerNum)) {
      this.triggerSpeech("Please enter a number between -20 and 20.")
    } else {

      if (answerNum < -20) {
        answerNum = -20
      } else if (answerNum > 20) {
        answerNum = 20
      }
      currentConfig.pitch = answerNum;
      this.setVoice(this.state.currentVoice, "Changed voice pitch.", currentConfig)
    }
  }

  grabVoiceData() {
    const ctx = this;

    $.ajax({
      url: "https://texttospeech.googleapis.com/v1beta1/voices?key=MY_API_KEY",
      type: "GET",
      success: function(data) {
        let arrayOfCodes = []
        for (let i = 0; i < data.voices.length; i++) {
          if ($.inArray(data.voices[i].languageCodes[0], arrayOfCodes) === -1) {
            arrayOfCodes.push(data.voices[i]['languageCodes'][0])
          }
        }

        let arrayOfGenders = []
        for (let i = 0; i < data.voices.length; i++) {
          if ($.inArray(data.voices[i]['ssmlGender'], arrayOfGenders) === -1) {
            arrayOfGenders.push(data.voices[i]['ssmlGender'])
          }
        }

        let prosigns = ctx.state.prosigns;
        prosigns[':cg'].mapping = arrayOfGenders.slice();
        prosigns[':cl'].mapping = arrayOfCodes.slice();

        ctx.setState({
          allVoiceData: data.voices,
          prosigns: prosigns
        })

      },
      error: function() {
        document.getElementById("input").disabled = false;
        document.getElementById("input").focus()
      }
    })
  }

  activateFeature(value, lastString) {
    console.log('activate feature')

    let trimmed = value.trim();
    console.log(value.length)
    console.log(trimmed.length)
    if (this.state.isInEditMode) {
      this.validate(trimmed)
    } else {
      if (this.state.prosigns[trimmed] !== undefined) {
        this.setState({
          isInEditMode: true,
          which: null
        })
        this.state.prosigns[trimmed]['function']()
      } else {
        if (trimmed[0] === ":") {
          this.triggerVocalizingProsign(trimmed, lastString)
        } else {
          this.triggerSpeech(value)
        }
      }
    }
  }

  triggerVocalizingProsign(value, lastString) {
    if (value === ":cr") {
      this.triggerSpeech(lastString)
    } else if (value[1] === "a") {
      let str = value.split(":a")[1]
      let num = parseInt(str, 10)
      if (answers[num] !== undefined) {
        this.triggerSpeech(answers[num])
        this.child.current.updateString(answers[num])
      } else {
        this.triggerSpeech("Sorry, I don't have that answer. Try a different number.")
      }
      document.getElementById("input").disabled = false;
      document.getElementById("input").focus()
    } else {
      this.triggerSpeech("Sorry, I don't know that prosign. Please try another.")
    }
  }

  validate(answer) {
    console.log("validate")
    if (this.state.which === ":cp") {
      this.state.prosigns[this.state.which]['set'](answer)
    } else {
      let validAnswers = this.state.prosigns[this.state.which]['mapping']
      if (parseInt(answer, 10) < validAnswers.length) {
        this.state.prosigns[this.state.which]['set'](answer)
      } else {
        this.triggerSpeech("Sorry, that setting isn't available at this time. Please try another option.")
      }
    }


  }

  changeVoiceGender() {
    this.triggerSpeech("Changing voice gender")
    this.setState({
      isInEditMode: true,
      which: ':cg'
    })
  }

  setVoiceGender(answer) {
    let currentVoice = this.state.currentVoice;
    currentVoice.ssmlGender = this.state.prosigns[this.state.which]['mapping'][answer];
    this.checkIfVoiceIsValid(currentVoice);
  }

  changeVoiceLocale(answer) {
    this.triggerSpeech("Changing voice locale")
    this.setState({
      isInEditMode: true,
      which: ':cl'
    })
  }

  setVoiceLocale(answer) {
    let currentVoice = this.state.currentVoice;
    currentVoice.languageCode = this.state.prosigns[this.state.which]['mapping'][answer]
    this.checkIfVoiceIsValid(currentVoice)
  }

  checkIfVoiceIsValid(voiceData) {
    console.log('check if voice is valid')
    let matches = [];
    for (let i = 0; i < this.state.allVoiceData.length; i++) {
      let thisVoice = this.state.allVoiceData[i];

      if (thisVoice.languageCodes[0].toLowerCase() === voiceData.languageCode.toLowerCase() &&
        thisVoice.ssmlGender === voiceData.ssmlGender) {
        matches.push(thisVoice)
      }
    }

    if (matches.length === 0) {
      this.triggerSpeech("Sorry, that setting isn't available at this time. Please try another option.")
    } else if (matches.length === 1) {
      let nextVoice = {
        languageCode: matches[0].languageCodes[0],
        name: matches[0].name,
        ssmlGender: matches[0].ssmlGender
      }
      this.setVoice(nextVoice, "Changing voice", this.state.audioConfig)
    } else {
      let prosigns = this.state.prosigns;
      prosigns[':cd'].mapping = matches.slice()

      this.triggerSpeech('Multiple voices available')
      this.setState({
        prosigns: prosigns,
        isInEditMode: true,
        which: ':cd'
      })
    }
  }

  changeVoiceDetail(limits) {
    console.log('change voice detail')
    let matches = []
    let arrayToMatchAgainst;
    if (limits == null) {
      arrayToMatchAgainst = this.state.allVoiceData.slice()
    } else {
      arrayToMatchAgainst = limits.slice()
    }

    let currentVoice = this.state.currentVoice;
    for (let i = 0; i < arrayToMatchAgainst.length; i++) {
      let thisVoice = arrayToMatchAgainst[i];
      if (thisVoice.languageCodes[0].toLowerCase() === currentVoice.languageCode &&
        thisVoice.ssmlGender === currentVoice.ssmlGender) {
        matches.push(thisVoice)
      }
    }

    if (matches.length > 1) {
      this.triggerSpeech("Changing voice version")
      let prosigns = this.state.prosigns;
      prosigns[':cd'].mapping = matches.slice()
      this.setState({
        prosigns: prosigns,
        isInEditMode: true,
        which: ':cd'
      })
    } else {
      this.triggerSpeech("No other versions available.")
      this.setState({
        isInEditMode:false,
        which: 'null'
      })
    }
  }

  setVoiceDetail(answer) {
    console.log('set voice detail')
    let currentVoice = this.state.currentVoice;
    currentVoice.name = this.state.prosigns[this.state.which]['mapping'][answer].name;
    this.setVoice(currentVoice, "Changed voice version to " + currentVoice.name, this.state.audioConfig)
  }

  setVoice(voice, text, config) {
    console.log('set voice')
    console.log(JSON.stringify(config))
    console.log(JSON.stringify(this.state.audioConfig))
    if (typeof voice === 'string') {
      this.setState({
        audioConfig: config,
        currentVoice: JSON.parse(voice),
        isInEditMode: false,
        which: null
      })
    } else if (typeof voice === 'object') {
      this.setState({
        audioConfig: config,
        currentVoice: voice,
        isInEditMode: false,
        which: null
      })
    }

    localStorage.setItem('voice', JSON.stringify(voice))
    localStorage.setItem('audioConfig', JSON.stringify(config))
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentVoice !== prevState.currentVoice || this.state.audioConfig !== prevState.audioConfig || prevState.which === ":cd" || prevState.which === ":cp") {
      this.triggerSpeech("Voice updated")
    }
  }

  triggerSpeech(text) {
    let ctx = this;
    let mydata = {
        'input':{
          'text':text
        },
        'voice':this.state.currentVoice,
        'audioConfig': this.state.audioConfig
      }

    $.ajax({
      url: "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyB4yKkLp6x40Uwte7sT8UTTO0l136-c7Ow",
      type: "POST",
      contentType: 'json',
      data: JSON.stringify(mydata),
      success: function(data) {
        if (snd !== undefined) {
          snd.pause();
        }
        snd = new Audio("data:audio/wav;base64," + data.audioContent);
        snd.autoplay = true;
        snd.play();

        snd.addEventListener('ended', function() {
          document.getElementById("input").disabled = false;
          document.getElementById("input").focus()
        })
      },
      error: function() {
        document.getElementById("input").disabled = false;
        document.getElementById("input").focus()
      }

    })
  }

  render() {
    let placeholder = "";
    if (this.state.isInEditMode === false) {
      placeholder = ''
    } else if (this.state.which === ":cp") {
      placeholder = "Please choose a number between <span style='font-weight:bold'>-20</span> and <span style='font-weight:bold'>20</span>."
    } else {
      placeholder = this.state.prosigns[this.state.which]['placeholder'];
      let mappings = this.state.prosigns[this.state.which]['mapping']
      for (let i = 0; i < mappings.length; i++) {
        if (this.state.which === ':cd') {
          placeholder += "<span style='font-weight:bold'>" + i + "</span> for " + mappings[i].name + ", "
        } else {
          placeholder += "<span style='font-weight:bold'>" + i + "</span> for " + mappings[i] + ",  "
        }
      }
    }

    return (
      <div className="app-wrap">
          <div className="app-container">
              <Input type="text"  ref={this.child}
                     triggerSpeech={this.triggerSpeech.bind(this)}
                     prosignDictionary={this.state.prosigns}
                     isInEditMode={this.state.isInEditMode}
                     placeholder={placeholder}
                     activateFeature={this.activateFeature.bind(this)}/>
          </div>
      </div>
    )
  }
}
