import React, { Component } from "react";
import './VidCap.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import TextTransition, { presets } from "react-text-transition";
import ReactPlayer from 'react-player';
import html2pdf from 'html2pdf.js';

class VidCap extends Component {

  constructor(props) {
    super(props);
    this.state = {caption: "", file: "", showDetes: false, greedy: "", beam_op: {}, beam_in: 3};
    this.handleBeamChange = this.handleBeamChange.bind(this);
  }

  onChangeFile(event) {
      event.stopPropagation();
      event.preventDefault();
      var file = event.target.files[0];
      var beam_kw = "beam_search_" + this.state.beam_in;
      this.setState({caption: "Generating Summary!"})

      var formData = new FormData();
      formData.append("file", file);
      this.setState({file: URL.createObjectURL(file)})
      formData.append("beam_index", this.state.beam_in);
      axios.post('http://localhost:5000/success', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
      }})
        .then(res => {
            // console.log({res});
            this.setState({caption: res.data.beam_search_caption, greedy: res.data.greedy_captiong, beam_op: res.data[beam_kw]})
        }).catch(err => {
            console.error({err});
        });
  }

  handleBeamChange(event) {
    this.setState({beam_in: event.target.value});
  }

  listComponent(url, caption) {
    return (<div className="item-div">
              <img className="image" alt = " "src={url} style={{float: "left"}}/>
              <h5 className="caption-text" style={{float: "right", verticalAlign: "middle"}}>{caption}</h5>
            </div>)
    
  }

  generatePDF = (summary) => {
    const element = document.querySelector('.card-div');
    // console.log(this.caption)
    // const formattedHTML = `<div class="main">${summary}</div>`;
    // const element = document.createElement('div');
    // element.innerHTML = formattedHTML;

    // var opt =
		// 	{
		// 	  margin:       1,
		// 	  // filename:     'pageContent_'+js.AutoCode()+'.pdf',
		// 	  image:        { type: 'jpeg', quality: 0.98 },
		// 	  html2canvas:  { scale: 2 },
		// 	  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
		// 	};


    if (element) {
        html2pdf().from(element).save();
    } else {
        console.error("Element with class 'main' not found.");
    }
  }

    
  render() {
    return (
        <div className="background">
          <div className="waveWrapper waveAnimation">
              <div className="waveWrapperInner bgTop">
                <div className="wave waveTop" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-top.png')`}}></div>
              </div>
              <div className="waveWrapperInner bgMiddle">
                <div className="wave waveMiddle" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-mid.png')`}}></div>
              </div>
              <div className="waveWrapperInner bgBottom">
              <div className="wave waveBottom" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-bot.png')`}}></div>
              </div>
            </div>
          <div id = "print">
          <div className="cap-class">
            {!this.state.showDetes ? 
              <div className="wrapper">
                <div className="main">
                  <div className="card-div">
                    <h1 className="label">{"Video Summarizer Tool"}</h1>
                    <input id="myInput"
                      style={{display: "none"}}
                      type="file"
                      ref={(ref) => this.upload = ref}
                      onChange={this.onChangeFile.bind(this)}
                      />
                    <input className="beam-input" placeholder="Beam Size" type="text" name="beam_size" onChange={this.handleBeamChange} />
                    <button className="button" onClick={()=>{this.upload.click();this.setState({caption: ""})}}>Upload a video (.mp4, .avi)</button>
                    <TextTransition className="results"
                      text={ this.state.caption }
                      springConfig={ presets.wobbly }
                    />
                    {this.state.caption && this.state.caption !== "Generating Summary!"? console.log(this.state.caption): null}
                    {this.state.caption && this.state.caption !== "Generating Summary!"?
                      <button className="buttonD" onClick={()=>{this.setState({showDetes: !this.state.showDetes})}}>Show Details</button>
                      : null
                    }
                    <button className = "buttonD" onClick={() => this.generatePDF(this.caption)}>Print</button>
                  </div>
                </div>
              </div>
              : 
              <div className="wrapper">
                <div className="details">
                  <div className="card-div">
                    <h4 className="details-label">{"Details"}</h4>
                    <ReactPlayer
                      className='react-player video'
                      url= {this.state.file}
                      width='30%'
                      height='30%'
                      controls = {true}
                    />
                    <div className="capt-container">
                      {Object.entries(this.state.beam_op).map(([key,value]) => this.listComponent(key, value))}
                    </div>
                    {/* <TextTransition className="results-details" style={{float: "right"}}
                      text={ this.state.caption }
                      springConfig={ presets.wobbly }
                    /> */}
                    {this.state.caption && this.state.caption !== "Generating Summary!"? 
                      <button className="buttonD" onClick={()=>{this.setState({showDetes: !this.state.showDetes})}}>Go Back</button> 
                      : null
                    }
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>
    )
  }
}

export default VidCap;