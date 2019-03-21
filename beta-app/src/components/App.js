import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Typist from 'react-typist';
import logo from "../imgs/ATB_Logo.png";
import axios from 'axios'
import ImageLoader from 'react-image-file';

class App extends Component {
   constructor(props) {
    super(props)
    this.state = {
      page: 1,
      time: null
    }
  }

  componentDidMount() {
    setInterval( () => {
      this.setState({
        time : this.getTime(), 
      })
    }, 1000)
  }

  getTime(){
    let time = new Date()
    let hour  = time.getHours()
    let minutes = time.getMinutes()
    let AMPM = "AM"
    if( hour > 12 ){
      hour = hour - 12
      AMPM = "PM"
    } 
    if(minutes < 10){
      minutes = `0${minutes}`
    }
    time = `${hour}:${minutes}`
    return(time)
  }

  slideFoward() {
    this.getImage()
    let that = this
    console.log("slideFoward", this.state)
    if(this.state.page > 0) {
       this.setState({
        page: this.state.page + 1
      })
    }
  }

  slideBackward() {
    let that = this
    console.log("slideBackward")

      if(this.state.page > 0) {
       this.setState({
        page: this.state.page - 1
      })
    }
  }


  slide(page){
    switch(page){
      case 1: return(  
        <div> 
          <div className="big_block blue_background white_font">
            <Typist >  
              <h1 className="white_font">What does it take</h1>
            </Typist>

          </div>
          <div className="big_block white_background">
              <h1 className="blue_font"><b>To be an</b></h1>
              <img className="ATB_logo" src={logo} /> 
              <h1 className="light_blue_font"><i>er</i></h1>
              <div>?</div>
          </div>
        </div>
      ); break;
      case 2: return( 
         <div> 
          <div className="big_block blue_background white_font">
            <Typist >  
              <h1 className="white_font">HIII</h1>
            </Typist>

          </div>
          <div className="big_block white_background">
     
          </div>
        </div>
      ); break;
    }
  }

  getImage() {
      console.log("getting a new image")
      //ajax get from db for new photo

      const url =  `http://localhost:8080/newPhoto`

      axios({
        params:{
        },
        url: url
      })
      .then((response) => {
        // let data = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  deleteImage(){
    console.log("DELETING")
    //ajax get from db for new photo
    const url =  `//localhost:8080/deletePhoto`
    axios({
      params:{
      },
      url: url,
      method: 'get'
    })
    .then((response) => {
      // let data = response.data
      this.getImage()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  dontShowPhoto(){
    console.log("DELETING")
    //ajax get from db for new photo
    const url =  `//localhost:8080/dontShowPhoto`
    axios({
      params:{
      },
      url: url,
      method: 'get'
    })
    .then((response) => {
      // let data = response.data
      this.getImage()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <div >
        <div className="bg">
          <div className="overlay">
            <p> {this.state.time} </p>
          </div>
          <div className="panal right" onClick={this.dontShowPhoto.bind(this)}>NoShow</div>
          <div className="panal left"  onClick={this.deleteImage.bind(this)}>Delete</div>

          <img src= {process.env.PUBLIC_URL + 'newPhoto.jpg'} className="bg big_block"/>
        </div>
      </div>
    )
  }
}

export default App
