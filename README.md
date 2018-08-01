# Morse + Wavenet Starter Code  

This is a text-to-speech (TTS) app that converts written text into spoken word. What makes this example Morse-compatible is that it allows folks to activate the voice with a unique Morse sequence. 

This experiment uses Google’s ML-powered [Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech/) which enables developers to synthesize natural-sounding speech with many voice options made possible via WaveNet from DeepMind.  

This experiment is part of a larger project to support Morse code for more accessible communication. Learn more at [g.co/morse](http://g.co/morse)

Built using Wavenet and Google Cloud Speech API

## Usage

Morse + Wavenet Starter Code requires [Yarn](https://yarnpkg.com/en/)

1. Run `yarn` to install all of the dependencies of this project.
2. Run `yarn start` to begin all file-watchers and to initialize the server on port 3000
3. Open `http://localhost:3000`

## Use Your Own Google API Key

In order to use this application, please replace the `MY_API_KEY` string in src/AppContainer/AppContainer.js with your own [Google API key](https://cloud.google.com/text-to-speech/).

## Contributors

Made by Jane Friedhoff and [Use All Five](https://useallfive.com).

This is not an officially supported Google product.

## License

Copyright 2018 Google Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Final Thoughts

We encourage open sourcing projects as a way of learning from each other. Please respect our and other creators’ rights, including copyright and trademark rights when present, when sharing these works and creating derivative work.

If you want more info on Google's policy, you can find that [here](https://policies.google.com/).
