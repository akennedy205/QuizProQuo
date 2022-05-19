import {useState, useEffect} from "react";
import "./style.css";
import { LeaderBoardTable } from "../../components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/fontawesome-free-solid";

function LeaderBoard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/scoreboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, []);
  //navigate to beginning but also refreshes page to change socket Id
  const handleClick = () => {
    navigate("/");
    window.location.reload();
  };

  const sorting = (e) => {
    const value = e.target.textContent;
    const sorted = [...leaderboard].sort((a, b) => {
      if (value === "Sort by Ascending") {
        return a.score - b.score;
      } else if (value === "Sort by Descending") {
        return b.score - a.score;
      }
      return a.score;
    });
    setLeaderboard(sorted);
  };

  const allLeaderboard = leaderboard.map((leaderboard, i) => {
    return (
      <div
        className="leaderboard-score"
        role="leaderboard-score"
        key={i}
        style={{display: "flex"}}
      >
       
        <p>{leaderboard.username} </p> 
        <p> {leaderboard.score}</p>
      </div>
    );
  });

  const homeBtn = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div id="leaderboard">
      <button id="backBtn" onClick={homeBtn}>
        <FontAwesomeIcon icon={faAngleDoubleLeft} bounce /> HOME
      </button>
      <button id="start-again" onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        PLAY AGAIN
      </button>
      <h2>Leaderboard </h2>
  
      <div className="leaderboard-container">
      
      <div className="sorting-btns">
          <button onClick={sorting} role="Ascending">
            Sort by Ascending
          </button>
          <button onClick={sorting} role="Descending">
            Sort by Descending
          </button>
        </div>
      {/* <LeaderBoardTable /> */}
      <div style={{display: 'flex', justifyContent: 'space-around', textAlign: 'center'}}>
      <p>Name</p><p>Score</p>
      </div>
      {allLeaderboard}

    </div>
    </div>
  );
}
export default LeaderBoard;
