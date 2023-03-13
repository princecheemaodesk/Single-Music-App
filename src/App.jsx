import { useEffect, useState } from 'react';
import { useSound } from "use-sound";
import { IconContext } from "react-icons";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import './App.css';
import mixkitLife from './assets/mixkit-life-is-a-dream-837.mp3';

export default function App() {

  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { pause, duration, sound }] = useSound(mixkitLife);

  const [currTime, setCurrTime] = useState({ minutes: "", seconds: "" });
  const [totalTime, setTotalTime] = useState({ minutes: "00", seconds: "00" });

  const [seconds, setSeconds] = useState(0);


  const playingBtn = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
      document.body.classList.remove("musicOn");
    }
    else {
      play();
      setIsPlaying(true);
      document.body.classList.add("musicOn");
    }
  }

  useEffect(() => {
    const musicSec = duration / 1000;
    const musicMin = Math.floor(musicSec / 60);
    const secRemain = Math.floor(musicSec % 60);
    setTotalTime({ minutes: ('0' + musicMin).slice(-2), seconds: ('0' + secRemain).slice(-2) });
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const minutes = ('0' + Math.floor(sound.seek([]) / 60)).slice(-2);
        const seconds = ('0' + Math.floor(sound.seek([]) % 60)).slice(-2);
        setCurrTime({ minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  return (
    <>
      <div className='musicAnimation'></div>
      <div className='component musicPlayerContainer'>
        <h2 className='playerItems'>Playing Now</h2>
        <img className='playerItems musicCover' src='https://picsum.photos/200/200' />
        <div className='playerItems albumInfo'>
          <h3 className='songTitle'>Mxkit life is a dream</h3>
          <p className='songSubTitle'>mixkit life is a dream 837</p>
        </div>
        <div className='playerItems actionBtnContainer'>
          {!isPlaying ?
            (<button className='playButton playBtn' onClick={playingBtn}><IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle></AiFillPlayCircle>
            </IconContext.Provider></button>) : (
              <button className='playButton pauseBtn' onClick={playingBtn}><IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
                <AiFillPauseCircle></AiFillPauseCircle>
              </IconContext.Provider></button>)
          }
        </div>
        <div className='playerItems seekbarContainer'>
          <div className="time">
            <p>{currTime.minutes}:{currTime.seconds}</p>
            <p>{totalTime.minutes}:{totalTime.seconds}</p>
          </div>
          <input type="range" min="0" max={duration / 1000} default="0" value={seconds} className="timeline" onChange={(e) => { sound.seek([e.target.value]) }} />
        </div>
      </div>
    </>
  )
}
