class AntGame {
  constructor(numAnts) {
    this.ants = [];
    this.container = document.querySelector(".container");
    this.numAnts = numAnts;
  }

  randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createRandomAnt() {
    const x = this.randomize(0, this.container.offsetWidth);
    const y = this.randomize(0, this.container.offsetHeight);
    const dx = this.randomize(1, 5);
    const dy = this.randomize(1, 5);
    const radius = this.randomize(10, 20);
    const size = 2 * radius;

    return {
      x,
      y,
      dx,
      dy,
      radius,
      size,
    };
  }

  drawAnt(ant) {
    const antElement = document.createElement("div");
    antElement.classList.add("ant");
    antElement.style.left = ant.x + "px";
    antElement.style.top = ant.y + "px";
    antElement.style.width = ant.size + "px";
    antElement.style.height = ant.size + "px";

    const rotation = Math.atan2(ant.dy, ant.dx) * (180 / Math.PI);
    antElement.style.transform = `rotate(${rotation}deg)`;

    antElement.addEventListener("click", () => this.killAnt(ant));
    this.container.appendChild(antElement);
  }

  killAnt(ant) {
    const antElement = document.querySelector(".ant");
    if (antElement) {
      this.container.removeChild(antElement);

      // Remove the ant from the ants array
      const antIndex = this.ants.indexOf(ant);
      if (antIndex > -1) {
        this.ants.splice(antIndex, 1);
        antsKilled++;
        updateScoreboard();

        const blood = document.createElement("div");
        blood.className = "blood";
        blood.style.left = ant.x + "px";
        blood.style.top = ant.y + "px";

        document.querySelector(".container").appendChild(blood);
        setTimeout(() => {
          blood.remove();
        }, 1000);
      }
    }
  }

  moveAnt(ant) {
    this.container.removeChild(document.querySelector(".ant"));
    ant.x += ant.dx;
    ant.y += ant.dy;

    // Adjusting ant position if it reaches the container boundaries
    if (ant.x + ant.size >= this.container.offsetWidth) {
      ant.x = this.container.offsetWidth - ant.size;
      ant.dx *= -1;
    } else if (ant.x < 0) {
      ant.x = 0;
      ant.dx *= -1;
    }

    if (ant.y + ant.size >= this.container.offsetHeight) {
      ant.y = this.container.offsetHeight - ant.size;
      ant.dy *= -1;
    } else if (ant.y < 0) {
      ant.y = 0;
      ant.dy *= -1;
    }

    this.drawAnt(ant);
    this.detectCollision(ant);
  }

  detectCollision(ant) {
    for (let i = 0; i < this.ants.length; i++) {
      const anotherAnt = this.ants[i];
      if (ant !== anotherAnt) {
        const dx = ant.x - anotherAnt.x;
        const dy = ant.y - anotherAnt.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ant.radius + anotherAnt.radius) {
          //collision occurs
          this.resolveCollision(ant, anotherAnt);
        }
      }
    }
  }
  resolveCollision(antA, antB) {
    const dx = antA.x - antB.x;
    const dy = antA.y - antB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radiiSum = antA.radius + antB.radius;

    //separating the overlapped ants
    const separationDistanceX = (dx / distance) * radiiSum;
    const separationDistanceY = (dy / distance) * radiiSum;

    antA.x = antB.x + separationDistanceX;
    antA.y = antB.y + separationDistanceY;

    //swapping the velocities of overlapped ants
    let tempX = antA.dx;
    let tempY = antA.dy;
    antA.dx = antB.dx;
    antA.dy = antB.dy;
    antB.dx = tempX;
    antB.dy = tempY;
  }

  init() {
    for (let i = 0; i < this.numAnts; i++) {
      const ant = this.createRandomAnt();
      this.ants.push(ant);
    }

    this.ants.forEach((ant) => this.drawAnt(ant));
    setInterval(() => {
      this.ants.forEach((ant) => this.moveAnt(ant));
    }, timing);
  }
}

function updateScoreboard() {
  const scoreBoard = document.getElementById("scoreboard");
  scoreBoard.innerHTML = `Score : ${antsKilled}`;
  if (antsKilled === numAnts) {
    resetGame();
  }
}
function resetGame() {
  const playAgain = document.createElement("div");
  playAgain.className = "play-again-button";
  playAgain.innerHTML = "Play Again";
  document.querySelector(".container").appendChild(playAgain);

  playAgain.addEventListener("click", () => {
    antsKilled = 0;
    const ants = document.querySelectorAll(".ant");
    ants.forEach((ant) => ant.remove());
    const blood = document.querySelectorAll(".blood");
    blood.forEach((bloodElement) => bloodElement.remove());
    playAgain.remove();
    updateScoreboard();
    antGame.init();
  });
}

const numAnts = 20;
const timing = 10;
let antsKilled = 0;
const antGame = new AntGame(numAnts);
antGame.init();
