import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
// const socket = window.io();
let socket = io('http://localhost:3001');

class App extends Component {

  state = {
    name:"house",
    message:"",
    chat: [],
    player1:"",
    player2:"",
    result:"Waiting Results",
    lobbyList:{},
    roomList:{}
  }

  choice = {
    player1: "",
    player2: ""
  }

  room = {
    roomName:"",
  }  

  componentDidMount(){
    //Every time there is a update on 'channel chat' 
    //message message Recieve funtion will run with data that was sent
    socket.on("connect",()=>{
      console.log("you have been connected!");

      socket.emit('Login',"guestuser");
      socket.on('user name', (msg)=>{
        this.setState({name:msg});
        console.log("clent: "+msg);
      })

      console.log();

      // if(Object.keys(this.state.lobbyList).length>1){
      //   console.log("there is more than 2 users");
      // }

    })

    socket.on('lobby list', (msg) =>{
      this.setState({lobbyList:msg});
    })

    socket.on('chat message',this.messageRecieve);
  }

  //function to compare actions taken by both users 
  checkAction () {

    var action1 = this.choice.player1;
    var action2 = this.choice.player2;
    console.log(action1);
    console.log(action2);

    console.log("#36: is this active?");
    if( action1 !=="" && action2!==""){

      if(action1 === action2){
        console.log("this matches");
        this.setState({
          result:"This Matches"
        });
        this.choice = {
          player1: "",
          player2: ""
        };

        //after result is display message will go back to pending
        setInterval(()=>{
          this.setState({
          result:"Waiting Results"
          });
        },3000)


      }
      else{
        console.log("this does not match");
        this.setState({
          result:"This does not Match"
        })
        this.choice = {
          player1: "",
          player2: ""
        };

        setInterval(()=>{
          this.setState({
          result:"Waiting Results"
          });
        },3000)
      }
      console.log("#39: both value changed");

    }
  }

  inputChange = event => {
    // Getting the value and name of the input which triggered the change
    var {name,value} = event.target;
    // Updating the input's state to be empty 
    this.setState({
      [name]: value,
      message:value
    });
  }

  //function to run on click of submit button
  //will send information to the server to recieve message
  sendMessage = event =>{
    event.preventDefault();

    //sends info of message and player through socket through channel called 'chat message'  
    socket.emit('chat message',{
      msg:this.state.message,
      player:event.target.getAttribute("name")
    });

    var {name} = event.target;

    this.setState({
      message:"",
      [name]:""
    });
    
  }

  //function that activates when user sends message msg is the data being received
  messageRecieve = msg =>{
    
    //with the data recieved msg will be added to chat 
    this.setState({chat:[...this.state.chat, {msg:msg.msg,key:Date.now()} ]});

    // data of which player sent message will be saved locally to compare
    this.choice[msg.player] = msg.msg;

    console.log(this.state.chat);
    console.log("is this working?");

    //everytime message is recieved will compare both string 
    this.checkAction();
  }

  render() {

    return (
      <div>
        <h1>Lobby User List</h1>
        <ul>
          {Object.keys(this.state.lobbyList).map( objectKey=>{
            return (<li key={this.state.lobbyList[objectKey]}>{this.state.lobbyList[objectKey]} </li> )
          })}
        </ul>
        <br></br>
        <br></br>
        <hr></hr>
        <h1>Room User List</h1>
        <ul>
          {Object.keys(this.state.roomList).map( objectKey=>{
            return (<li key={this.state.roomList[objectKey]}>{this.state.roomList[objectKey]} </li> )
          })}
        </ul>
        <br></br>
        <br></br>
        <hr></hr>
        <h2>User Name</h2>
        <p>{this.state.name}</p>
        <br></br>
        <br></br>
        <hr></hr>

        <p>{this.state.message}</p>
        <p>{this.state.result}</p>
        <ul id="messages">
          {this.state.chat.map(chat =>{
            return (<li key={chat.key}>{chat.msg}</li>)
          })
          }
        </ul>
        <form action="">
          <input 
          name="player1"
          id="m" 
          value = {this.state.player1}
          autoComplete="off"
          onChange = {this.inputChange}
          // value = {this.state.message}
          />
          <button 
          name="player1"
          onClick={this.sendMessage}>Send
          </button>
        </form>
        <form action="">
          <input 
          name="player2"
          id="m" 
          value = {this.state.player2}
          autoComplete="off"
          onChange = {this.inputChange}
          // value = {this.state.message}
          />
          <button 
          name="player2"
          onClick={this.sendMessage}>Send</button>
        </form>
      </div>
    );
  }
}

export default App;
