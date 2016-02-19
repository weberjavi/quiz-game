//var read = require("read"); // requerimos la librería read (npm) para acceder a las respuestas del usuario
var readline = require("readline"); // requerimos la librería readline (npm) para acceder a las respuestas del usuario
var fs = require("fs");

savedGames = './saved_games.txt'


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


///////////////////
/// CLASES
//////////////////

// User
var User = function(name){
  this.total_points = 0;
  this.name = name;
  this.current_question_id;
  this.current_game;
}

// Question
var Question = function(prompt, answer, points, neg_points){  
  this.id = Question.id++;
  this.prompt = prompt;
  this.answer = answer;
  this.points = points;
  this.neg_points = neg_points
}

// Quiz
var Quiz = function(questions, user){
  this.questions = questions;
  this.user = user;
  this.askQuestion = function(rq){
    var self = this; //self se refiere al scope de Quiz
    // Guardamos el id de la pregunta para iniciar desde aqui cuando el usuario recupere la partida
    self.user.current_question_id = rq.id;
    console.log(self.user.total_points)
    rl.question(rq.prompt, function(current_answer){
      if (current_answer.toLowerCase() === rq.answer.toLowerCase()) {
        self.user.total_points += rq.points;
        console.log("--------\nright answer!!");
        console.log("--------------------\nCurrently you have " + self.user.total_points + " points.\n--------------------");
        questions.splice(questions.indexOf(rq), 1);
      } else if (current_answer.toLowerCase() === "save"){
        self.user.current_game = self;
        fs.writeFile(savedGames, JSON.stringify(self), function(err) {
          console.log('File was not saved');
        });
        return console.log(self.user);
      } else {
        self.user.total_points += rq.neg_points
        console.log("That answer was not correct, keep trying!!")
        console.log("--------------------\nCurrently you have " + self.user.total_points + " points.\n--------------------")
        questions.splice(questions.indexOf(rq), 1);
      }
      self.selectQuestion();
    });
  }

  this.selectQuestion = function(){
    if(this.questions.length > 0) {
      var rq = this.questions[Math.floor(Math.random() * this.questions.length)];
      this.askQuestion(rq);
    } else {
      console.log("User results:\nCongratulations " + this.user.name + " you've get " + this.user.total_points + " points!");
    }
  }
}

///////////////////
/// A JUGARR!!!
//////////////////

// Valores iniciales
Question.id = 1; //first question id
// Usuario
var perico = new User("Perico");
// Preguntas
easy_game = [
  q1 = new Question("Which is Spain's capital?", "Madrid", 1, -3),
  q2 = new Question("Which is France's capital?", "Paris", 1, -3),
  q3 = new Question("In wich city are the head quarters of the United Nations", "New York", 2, -2),
  q4 = new Question("what was the name of Kublai Khan's Mongol empire capital?", "Xanadu", 3, -1)
]

hard_game = [
  q1 = new Question("Which is China's capital?", "Madrid", 1, -3),
  q2 = new Question("Which is Malta's capital?", "Paris", 1, -3),
  q3 = new Question("In wich city are the head quarters of the Avengers", "New York", 2, -2),
  q4 = new Question("what was the name of Genghis Khan's Mongol empire capital?", "Xanadu", 3, -1)
]
//Inicio del juego
var init = "New Game?\nType yes or no\n";
var new_user = "Please register.\nEnter your name and let's play!!\n";
var level = "You want the EASY quiz or the HARD one\n";
var registered_user = "Then enter your name and let's take it back where we leave it.\n"

function start_game(){
  rl.question(init, function(answer) {
    if(answer.toLowerCase() === "yes"){
      rl.question(new_user, function(new_user_name) {
        new User(new_user_name);
        rl.question(level, function(quiz_level) {
          if (quiz_level.toLowerCase() === "easy") {
            nueva_partida = new Quiz(easy_game, new_user_name);
            nueva_partida.selectQuestion();
          }else if(quiz_level.toLowerCase() === "hard"){
            new Quiz(hard_game, new_user_name).selectQuestion();
          } else{
            console.log("I don't understand what youre saying.\n Let's try again.\n")
             start_game();
           }
        })
      })
    }else{
      rl.question(registered_user, function(saved_game_name){
        console.log("Recupera este nombre del archivo: " + saved_game_name + ".")
      })
    } 
  })
}




start_game();













