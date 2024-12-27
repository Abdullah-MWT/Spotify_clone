console.log('Let,s get this party started!');
let currentSong = new Audio();

function formatTime(seconds) {
  // Round the seconds to 2 decimal places to avoid extra precision
  seconds = Math.round(seconds);

  const minutes = Math.floor(seconds / 60);  // Get the minutes
  const remainingSeconds = seconds % 60;     // Get the remaining seconds

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function playSongs() {
     const songsData = await fetch('http://127.0.0.1:5500/songs/');
     const response = await songsData.text();
    //  console.log(response);
     
    
     let div = document.createElement('div');
     div.innerHTML = response

     let as = div.getElementsByTagName('a');
    //  console.log(as);

     songs = []
     for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }
     }
  
     return songs; 
     
}

const playMusic = (track, play = false) => {
// Play the first Song  
currentSong.src = decodeURI(track);
currentSong.play(); 
play.src = './images/pause.svg'
document.querySelector('.songInfo').innerHTML = track.split('/songs/')[1];
document.querySelector('.songTime').innerHTML = '00.00 / 00.00'
}


async function main() {
    // Get the list of All songs 
    let songs = await playSongs();
    playMusic(songs[0], true)
    // console.log(songs); 


  
  let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];
  for (const song of songs) {  
    songUl.innerHTML = songUl.innerHTML + `<li>
                <img class="invert" src="./images/music.svg" alt="musicpic" />
                <div class="info">
                  <div>${song.replaceAll('%20', ' ')}</div>
                  <div>Abdullah</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="/images/play.svg" alt="playpic" />
                </div>
              </li>`
  }
  // Attach Event listnere to all the songs
Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
  e.addEventListener('click', element=> {
    console.log(e.querySelector('.info').firstElementChild.innerHTML);
    playMusic(e.querySelector('.info').firstElementChild.innerHTML)
  })
 
}) 


 // Attach Event listnere to play, next and previous button
 const play = document.querySelector('#play')
 play.addEventListener('click', () => {
     if (currentSong.paused) {
         currentSong.play()
         play.src = './images/pause.svg'
         
        } else{
          currentSong.pause();
          play.src = './images/play.svg'
     }
 })


 // Listen for timeupdate Event
  currentSong.addEventListener('timeupdate', () => {
    //  console.log(currentSong.currentTime, currentSong.duration);
     document.querySelector('.songTime').innerHTML = `
        ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}
     `
     document.querySelector('.circle').style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`
  })

  // Add an event listener to the seek bar
  document.querySelector('.playseek').addEventListener('click', e => {
    document.querySelector('.circle').style.left = (e.offsetX/e.target.getBoundingClientRect().width) * 100 + '%';
    currentSong.currentTime = currentSong.duration * (e.offsetX/e.target.getBoundingClientRect().width)
  })

  // Add an event listener to the hamburger menu
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.left').style.left = 0;
  })

  // Add an event listener to the close button
  document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.left').style.left = '-100%';
  })

    
}

main();