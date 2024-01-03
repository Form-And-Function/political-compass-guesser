import logo from './logo.svg';
import './App.css';
import femaleData from './data/femaleData.json'
import maleData from './data/maleData.json'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PoliticalCompass from './components/PoliticalCompass';


function App() {
  console.log(femaleData);
  const diagramWidth = 1000;

  let score = 0;

  const graphs = {
    "Female Data": femaleData,
    "Male Data": maleData
  }

  let currGraphsIdx = 0;
  let currDatapointIdx = 0;
  let numPlayers = 1;
  let maxNumPlayers = 10;
  
  function drawPoint(x, y, color, status) {
    const svg = document.querySelector('svg');
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", "5");
    circle.setAttribute("fill", color);
    
    if (status === "truth") {
      circle.classList.add("truth");
      circle.classList.add("newest-point");
    } else {
      circle.classList.add("guess");
    }
    svg.appendChild(circle);
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  }

  function getNextQuestion() {
    const graph = graphs[Object.keys(graphs)[currGraphsIdx]];
    const datapointName = Object.keys(graph[currDatapointIdx])[0];
    //  datapoint is bolded
    return "Where does <strong>" + datapointName + "</strong> fall on the political compass?";
  }

  function updateDatasetName() {
    document.getElementById("dataset-name").innerHTML = "Dataset: " + Object.keys(graphs)[currGraphsIdx];
  }

  function adjustScore(questionScore) {
    score += questionScore;
    document.getElementById("score").innerHTML = "Your score: " + score + " out of " + (currDatapointIdx + 1) * 100;
    document.getElementById("question-score").innerHTML = "Question score: " + questionScore + " out of 100";
  }

  function handleClick(e) {
    const rect = document.querySelector('svg').getBoundingClientRect(); 
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    console.log("Client X and Y: " + e.clientX + " " + e.clientY);

    // Remove any previous guesses
    const prevGuesses = document.getElementsByClassName("guess");
    for (let i = 0; i < prevGuesses.length; i++) {
      prevGuesses[i].remove();
    }
    // Draw a circle at the click location
    // drawPoint(e.clientX, e.clientY, "black");
    drawPoint(x, y, "black", "guess");

    const trueX = (2*x - diagramWidth) / diagramWidth;
    const trueY = (diagramWidth - 2*y) / diagramWidth;

    const graph = graphs[Object.keys(graphs)[currGraphsIdx]];
    console.log(graph);
    const datapoint = Object.values(graph[currDatapointIdx])[0];

    console.log(datapoint);


    const svg = document.querySelector('svg');

    // Change color of previous datapoint to red
    const prevDatapoints = svg.getElementsByClassName("newest-point");
    if (prevDatapoints.length > 0) {
      for (let i = 0; i < prevDatapoints.length; i++) {
        prevDatapoints[i].setAttribute("fill", "red");
        prevDatapoints[i].classList.remove("newest-point");
      }
    }

    // Draw a circle at the correct location
    drawPoint((datapoint[0] + 1)/2 * diagramWidth,(1 - datapoint[1])/2 * diagramWidth, "white", "truth");
    // Add label to datapoint
    const datapointName = Object.keys(graph[currDatapointIdx])[0];
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.classList.add("label");
    text.setAttribute("x", (datapoint[0] + 1)/2 * diagramWidth);
    text.setAttribute("y", (1 - datapoint[1])/2 * diagramWidth + 15);
    text.setAttribute("font-size", "10");
    text.setAttribute("fill", "black");
    text.innerHTML = datapointName;
    svg.appendChild(text);
    
    const L2 = Math.sqrt(Math.pow(datapoint[0] - trueX, 2) + Math.pow(datapoint[1] - trueY, 2));
    const MSE = (Math.pow(datapoint[0] - trueX, 2) + Math.pow(datapoint[1] - trueY, 2)) / 2;
    
    let questionScore = Math.round((1-L2*2) * 100);
    if (questionScore < 0) {
      questionScore = 0;
    }

    console.log("MSE: " + MSE);

    adjustScore(questionScore);
    // console.log("currDatapointIdx" + currDatapointIdx + " " +document.getElementById("score").innerHTML);
    
    currDatapointIdx++;
    if (currDatapointIdx >= graph.length) {
      // Pop up showing score
      alert("You're done! Final score: " + score + " out of " + graph.length * 100);
      // Reset score
      score = 0;
      currDatapointIdx = 0;
      currGraphsIdx++;
      if (currGraphsIdx >= Object.keys(graphs).length) {
        currGraphsIdx = 0;
      }
      resetGraph();
      updateDatasetName();
    }

    document.getElementById("question").innerHTML = getNextQuestion();
  }

  function resetGraph() {
    const svg = document.querySelector('svg');
    let classes_to_remove = ["truth", "guess", "label"];
    for (let i = 0; i < classes_to_remove.length; i++) {
      const className = classes_to_remove[i];
      const datapoints = svg.getElementsByClassName(className);
      while (datapoints.length > 0) {
        datapoints[0].remove();
      }
    }
    document.getElementById("question").innerHTML = getNextQuestion();
  }

  function resetAll() {
    resetGraph();
    score = 0;
    currDatapointIdx = 0;
    currGraphsIdx = 0;
    updateDatasetName();
    adjustScore(0);
    document.getElementById("question").innerHTML = getNextQuestion();
  }

  for(let graph of Object.values(graphs)) {
    shuffle(graph);
  }

  // on load, reset all
  window.onload = resetAll;
  

  return (
    <div className="App">
    <DropdownButton id="dropdown-basic-button" title="Number of players">
      {[...Array(maxNumPlayers).keys()].map((i) => {
        return <Dropdown.Item onClick={() => {numPlayers = i + 1; document.getElementById("num-players").innerHTML = "Number of players: " + numPlayers;}}>{i + 1}</Dropdown.Item>
      })}
    </DropdownButton>
      <p id="dataset-name">Dataset name: {Object.keys(graphs)[currGraphsIdx]}</p>
      <p id="question">Placeholdertext</p>
      <p id="score">Your score: {score}</p>
      <p id="question-score"><br></br></p>
      <p class="instructions">Click on the political compass to place your guess. The closer your guess is to the actual answer, the more points you get. You get up to 100 points per question.</p>
      <p class="instructions">There are {Object.values(graphs)[currGraphsIdx].length} questions in this dataset. You can change the dataset by clicking the "Reset" button.</p>
      <p id="num-players">Number of players: {numPlayers}</p>
      {/* <button onClick={resetAll}>Reset</button> */}
      <PoliticalCompass handleClick={handleClick}/>
      </div>
  );
}

export default App;
