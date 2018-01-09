import React, { Component } from 'react'
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom'
import Typist from 'react-typist';
import logo from "../imgs/ATB_Logo.png";


class App extends Component {
   constructor(props) {
    super(props)
    this.state = {
      page: 1
    }
  }

  slideFoward() {
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

  render() {
    return (
      <div>
        {this.slide(this.state.page)}
         <div className="next light_blue_font">
          <div onClick={this.slideFoward.bind(this)} >Next</div>
        </div>
      </div>
    )
  }
}

export default App