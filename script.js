document.addEventListener("DOMContentLoaded", (event) => {
  main();
});

let paddle_area_w = 0;

function animate_penger_header() {
  let translate_x = 0;
  let speed = 10;
  let scale_x = 1;
  let penger_size = 32;
  setInterval(() => {
    if (translate_x >= paddle_area_w - penger_size) {
      speed = -10;
      scale_x = -1;
    } else if (translate_x <= 0) {
      speed = +10;
      scale_x = 1;
    }
    translate_x += speed;
    paddle_gif.style.transition = "all 0.3s linear";
    paddle_gif.style.transform = `translateX(${translate_x}px) scaleX(${scale_x})`;
  }, 300);
}

function showSection(sectionName) {
  window.location.hash = "#" + sectionName;

  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const selectedSection = document.getElementById(sectionName + '-section');
  if (selectedSection) {
    selectedSection.classList.add('active');
  }

  const activeNav = document.getElementById(sectionName + '_nav');
  if (activeNav) {
    activeNav.classList.add('active');
  }

  document.querySelector('.tui-sidenav').classList.remove('tui-show');

  window.scrollTo(0, 0);

  switch (sectionName) {
    case "projects":
      initProjectsPage();
    case "home":
      initHomePage();
  }
}

function initHomePage() {
  const ctx = penger_canvas.getContext('2d');
  const penger_img = new Image();

  penger_img.onload = function() {
    let x = 10; let y = 10;
    let dx = 1; let dy = 1;
    let x_dir = 1; let y_dir = 1;

    const renderOneFrame = () => {
      let penger_size = 40;
      const w = penger_canvas.width;
      const h = penger_canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (h < 40) penger_size = 15;

      if (x + penger_size >= w) {
        x_dir = -1;
      } else if (x <= 0) {
        x_dir = 1;
      }
      if (y + penger_size >= h) {
        y_dir = -1;
      } else if (y <= 0) {
        y_dir = 1;
      }
      x = x + (dx * x_dir);
      y = y + (dy * y_dir);
      ctx.drawImage(penger_img, x, y, penger_size, penger_size);
      requestAnimationFrame(renderOneFrame);
    }
    requestAnimationFrame(renderOneFrame);
  };

  penger_img.src = "assets/jetger.gif";

  const resizeCanvas = () => {
    const rect = penger_canvas.getBoundingClientRect();
    penger_canvas.width = rect.width;
    penger_canvas.height = rect.height;

    paddle_area_w = paddle_area.offsetWidth;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function initProjectsPage() {
  const animationMap = {
    "ex1": {
      initial: -80,
      step: 3
    },
    "ex2": {
      initial: -100,
      step: 3
    },
    "ex3": {
      initial: -120,
      step: 3
    },
    "ex4": {
      initial: -70,
      step: 3
    },
    "ex5": {
      initial: -140,
      step: 3
    },
    "ex6": {
      initial: -160,
      step: 3
    },
    "ex7": {
      initial: -60,
      step: 3
    },
    "ex8": {
      initial: -200,
      step: 3
    },
  }

  for (let [ex, anim] of Object.entries(animationMap)) {
    let z = anim.initial;

    const interval = setInterval(() => {
      z += anim.step;
      if (z >= 0) {
        z = 0;
        clearInterval(interval);
      }
      const ex_elem = document.getElementById(ex);
      ex_elem.style.transform = `perspective(400px) scaleZ(1) translateZ(${z}px)`;
    }, 10)
  }

  const ex1 = document.getElementById("ex1");
  const ex3 = document.getElementById("ex3");
  const penger_img = document.getElementById("penger_img");

  document.addEventListener("mousemove", (e) => {
    const { left: ex1_left, width: ex1_width, top: ex1_top } = ex1.getBoundingClientRect();
    const { left: ex3_left, width: ex3_width } = ex3.getBoundingClientRect();
    const { top:  ex6_top, height: ex6_height } = ex6.getBoundingClientRect();
    const { width: penger_img_width, left: penger_img_left, top: penger_img_top } = penger_img.getBoundingClientRect();
    const mouseLeft = e.clientX;
    const mouseTop  = e.clientY;

    if (mouseLeft > ex3_left + ex3_width || mouseLeft < ex1_left || mouseTop < ex1_top || mouseTop > ex6_top + ex6_height) {
      if (penger_img.getAttribute("src") !== "assets/sleepger.gif") {
        penger_img.src = "assets/sleepger.gif";
      }
      penger_img.style.transform = "scaleX(1)";
    } else {
      const { width: penger_img_width, left: penger_img_left, top: penger_img_top, height: penger_img_height } = penger_img.getBoundingClientRect();
      let angle = 0;
      let scaleX = 1;
      const closeness = 80;
      const xDistToPenger = Math.abs(penger_img_left + penger_img_width/2  - mouseLeft);
      const yDistToPenger = Math.abs(penger_img_top  + penger_img_height/2 - mouseTop);
      const distToPengerSqr = xDistToPenger * xDistToPenger + yDistToPenger * yDistToPenger;

      if (distToPengerSqr < closeness * closeness) {
        if (penger_img.getAttribute("src") !== "assets/penger_giga.gif") {
          penger_img.src = "assets/penger_giga.gif";
        }
      } else {
        scaleX = mouseLeft > penger_img_left + penger_img.width ? -1 : 1;
        const tan = yDistToPenger / xDistToPenger;
        const sign = mouseTop < penger_img_top ? -1 : 1;
        angle = Math.atan(tan) * (180 / Math.PI) * sign * (scaleX * -1);
        penger_img.src = "assets/penger_h.png";
      }

      penger_img.style.transform = `rotate(${angle}deg) scaleX(${scaleX})`;
    }
  })
}

function main() {
  paddle_area_w = paddle_area.offsetWidth;
  animate_penger_header();

  switch (window.location.hash.substring(1)) {
    case "projects":
      showSection("projects");
      break;
    default:
      showSection("home");
  }

  let redirect_target = null;
  let current_theme = 'tui-bg-green-white';
  main_background.classList.add(current_theme);


  github_btn.addEventListener('click', (event) => {
    redirect_target = "https://github.com/trieu-h";
  })

  email_btn.addEventListener('click', (event) => {
    const link = document.createElement('a');
    link.href = "mailto:lehuynhhaitrieu1996@gmail.com?subject=Question";
    link.target = "_blank";
    link.click();
    link.remove();
  })

  linkedin_btn.addEventListener('click', (event) => {
    redirect_target = "https://www.linkedin.com/in/lehhtrieu/";
  })

  spotify_btn.addEventListener('click', (event) => {
    redirect_target = "https://open.spotify.com/user/21f35zermwpo6nb6w6jtbshey?si=3423c1048aba4577";
  })

  leave_btn.addEventListener('click', (event) => {
    window.open(redirect_target, '_blank');
  })

  cancel_btn.addEventListener('click', (event) => {
    redirect_target = null;
  })

  background_picker.addEventListener('click', (event) => {
    main_background.classList.remove(current_theme);
    current_theme = event.target.getAttribute('data-background');
    main_background.classList.add(current_theme);
  })


  // Projects page
}


