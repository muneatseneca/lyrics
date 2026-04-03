// ==========================
// SELECT ELEMENTS
// ==========================
const line1 = document.querySelector("#line1");
const line2 = document.querySelector("#line2");
const line3 = document.querySelector("#line3");
const line4 = document.querySelector("#line4");

const word3 = document.querySelector("#line3 .swap3");
const restartBtn = document.querySelector("#restartBtn");
const aliveLetters = document.querySelectorAll("#line4 .letter");


// ==========================
// FONT SYSTEM (line3)
// ==========================
let fontInterval = null;
let fontIndex = 0;
const fonts = ["font1", "font2", "font3", "font4"];

word3.classList.add("font1");


// ==========================
// TYPEWRITER (SAFE)
// ==========================
function typeWriter(element, speed = 15) {
  if (element === line3) return;

  const aliveSpan = element.querySelector(".alive");

  let text;

  if (aliveSpan) {
    // only type the text BEFORE "alive"
    text = element.childNodes[0].textContent;
    aliveSpan.style.opacity = 0;
    element.childNodes[0].textContent = "";
  } else {
    text = element.textContent;
    element.textContent = "";
  }

  let i = 0;

  function type() {
    if (i < text.length) {
      if (aliveSpan) {
        element.childNodes[0].textContent += text.charAt(i);
      } else {
        element.textContent += text.charAt(i);
      }

      i++;
      setTimeout(type, speed);
    } else {
      // reveal "alive"
      if (aliveSpan) {
        gsap.to(aliveSpan, { opacity: 1, duration: 0.2 });
      }
    }
  }

  type();
}


// ==========================
// TRANSITION (FIXED BUTTON LOGIC)
// ==========================
function transition(current, next) {
  gsap.to(current, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      current.style.display = "none";
      next.style.display = "block";

      gsap.fromTo(
        next,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 }
      );

      typeWriter(next);

      // ✅ BUTTON VISIBILITY (FIXED)
      if (next === line4) {
        restartBtn.style.display = "block";
      } else {
        restartBtn.style.display = "none";
      }
    }
  });
}


// ==========================
// GENERIC SETUP
// ==========================
function setupLine(line, nextLine, hoverIn, hoverOut, holdEffect, resetEffect) {
  let holdTimer;
  let isHolding = false;

  line.addEventListener("mouseenter", hoverIn);
  line.addEventListener("mouseleave", hoverOut);

  line.addEventListener("mousedown", () => {
    isHolding = false;

    holdTimer = setTimeout(() => {
      isHolding = true;
      holdEffect();
    }, 200);
  });

  line.addEventListener("mouseup", () => {
    clearTimeout(holdTimer);

    if (isHolding) {
      resetEffect();
    } else {
      if (nextLine) transition(line, nextLine);
    }
  });
}


// ==========================
// LINE 1
// ==========================
setupLine(
  line1,
  line2,

  () => gsap.to(line1, { y: -10, color: "#ff4444", duration: 0.3 }),
  () => gsap.to(line1, { y: 0, color: "#ffffff", duration: 0.3 }),

  () => gsap.to(line1, { scaleY: 5, duration: 0.3 }),
  () => gsap.to(line1, { scaleY: 1, duration: 0.2 })
);


// ==========================
// LINE 2 (RECTANGLE HOLD)
// ==========================
setupLine(
  line2,
  line3,

  () => gsap.to(line2, { letterSpacing: "10px", duration: 0.3 }),
  () => gsap.to(line2, { letterSpacing: "0px", duration: 0.3 }),

  () => {
    line2.style.backgroundColor = "#ff0000";
    gsap.to(line2, {
      color: "#000000",
      scaleX: 1.5,
      duration: 0.3
    });
  },

  () => {
    line2.style.backgroundColor = "transparent";
    gsap.to(line2, {
      color: "#ffffff",
      scaleX: 1,
      duration: 0.2
    });
  }
);


// ==========================
// LINE 3 (FONT GLITCH HOLD)
// ==========================
setupLine(
  line3,
  line4,

  // hover (no font change)
  () => {
    gsap.to(line3, { opacity: 0.6, duration: 0.3 });
  },

  () => {
    gsap.to(line3, { opacity: 1, duration: 0.3 });
  },

  // HOLD
  () => {
    gsap.to(line3, { rotation: 5, x: 5, duration: 0.3 });

    clearInterval(fontInterval);

    fontInterval = setInterval(() => {
      word3.classList.remove(...fonts);
      word3.classList.add(fonts[fontIndex]);

      fontIndex = (fontIndex + 1) % fonts.length;
    }, 120);
  },

  // RESET
  () => {
    gsap.to(line3, { rotation: 0, x: 0, duration: 0.2 });

    clearInterval(fontInterval);

    word3.classList.remove(...fonts);
    word3.classList.add("font1");
  }
);


// ==========================
// LINE 4
// ==========================
setupLine(
  line4,
  null,

  // hover IN → hide button
  () => {
    gsap.to(document.body, {
      backgroundColor: "#ff0000",
      duration: 0.3
    });

    gsap.to(line4, {
      color: "#000000",
      scale: 1.05,
      duration: 0.3
    });

    // 🔥 HIDE while hovering
    restartBtn.style.display = "none";
  },

  // hover OUT → show button again
  () => {
    gsap.to(document.body, {
      backgroundColor: "#000000",
      duration: 0.3
    });

    gsap.to(line4, {
      color: "#ffffff",
      scale: 1,
      duration: 0.3
    });

    // 🔥 SHOW when not hovering
    restartBtn.style.display = "block";
  },

  // hold
  () => {
    gsap.to(line4, { scale: 1.3, duration: 0.3 });

    aliveLetters.forEach(letter => {
      function animate() {
        gsap.to(letter, {
          x: gsap.utils.random(-60, 60),
          y: gsap.utils.random(-60, 60),
          rotation: gsap.utils.random(-90, 90),
          scaleX: gsap.utils.random(0.5, 2),
          scaleY: gsap.utils.random(0.5, 2),
          duration: 0.03,
          ease: "none",
          onComplete: animate // 🔥 THIS is the trick
        });
      }

      animate();
    });
  },

  // reset
  () => {
    gsap.to(line4, { scale: 1, duration: 0.2 });

    aliveLetters.forEach(letter => {
      gsap.killTweensOf(letter); // 🔥 stops the chaos

      gsap.set(letter, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
      });
    });
  }
);


// ==========================
// RESTART
// ==========================
let isRestarting = false;

function restartExperience() {
  if (isRestarting) return;
  isRestarting = true;

  clearInterval(fontInterval);

  word3.classList.remove(...fonts);
  word3.classList.add("font1");

  line1.style.display = "block";
  line2.style.display = "none";
  line3.style.display = "none";
  line4.style.display = "none";

  gsap.set([line1, line2, line3, line4], {
    clearProps: "all"
  });

  gsap.set(document.body, {
    backgroundColor: "#000000"
  });

  restartBtn.style.display = "none";

  typeWriter(line1);

  setTimeout(() => {
    isRestarting = false;
  }, 500);
}

restartBtn.addEventListener("click", restartExperience);


// ==========================
// START
// ==========================
window.addEventListener("load", () => {
  typeWriter(line1);
});

const allLines = [line1, line2, line3, line4];

allLines.forEach(line => {
  function jitter() {
    gsap.to(line, {
      x: gsap.utils.random(-2, 2),
      y: gsap.utils.random(-2, 2),
      duration: 0.12,
      ease: "none",
      onComplete: jitter
    });
  }

  jitter();
});

function textureFlicker() {
  gsap.to(".texture", {
    opacity: gsap.utils.random(0.09, 0.15),
    filter: `brightness(${gsap.utils.random(0.9, 1.2)})`,
    duration: gsap.utils.random(0.05, 0.15),
    ease: "none",
    onComplete: textureFlicker
  });
}

textureFlicker();

gsap.set(".chain2 .chains-inner", { y: "-20%" });
gsap.set(".chain3 .chains-inner", { y: "-35%" });

gsap.to(".chains-inner", {
  y: "-50%",
  duration: 20,
  ease: "none",
  repeat: -1
});