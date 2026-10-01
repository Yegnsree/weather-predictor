var skyRun = 0; // changes every time the sky changes, so old animations stop

function setSky(type) {
  skyRun++;
  var run = skyRun;
  var sky = document.getElementById("sky");
  sky.className = "sky " + type;
  sky.innerHTML = "";

  // Drifting clouds (fewer when sunny)
  var count = type === "sunny" ? 2 : 7;
  for (var i = 0; i < count; i++) {
    var c = document.createElement("div");
    c.className = "cloud";
    c.style.top = Math.random() * 45 + "%";
    c.style.width = 200 + Math.random() * 250 + "px";
    c.style.height = 60 + Math.random() * 50 + "px";
    c.style.animationDuration = 50 + Math.random() * 60 + "s";
    c.style.animationDelay = "-" + Math.random() * 80 + "s";
    sky.appendChild(c);
  }

  if (type === "sunny") {
    sky.insertAdjacentHTML("beforeend", '<div class="rays"></div><div class="sun"></div>');
  }
  if (type === "rainy" || type === "stormy") makeRain(sky, run);
  if (type === "stormy") makeLightning(sky, run);
}

function makeRain(sky, run) {
  var canvas = document.createElement("canvas");
  canvas.className = "rain";
  sky.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  var drops = [];
  for (var i = 0; i < 180; i++) {
    drops.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                 len: 12 + Math.random() * 16, speed: 12 + Math.random() * 10 });
  }

  function draw() {
    if (run !== skyRun) return; // a newer sky replaced this one
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(190,215,255,0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    drops.forEach(function (d) {
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.len);
      d.y += d.speed;
      if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
    });
    ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}

function makeLightning(sky, run) {
  var flash = document.createElement("div");
  flash.className = "flash";
  sky.appendChild(flash);

  function strike() {
    if (run !== skyRun) return;
    flash.style.opacity = 0.85;
    setTimeout(function () { flash.style.opacity = 0.1; }, 80);
    setTimeout(function () { flash.style.opacity = 0.7; }, 160);
    setTimeout(function () { flash.style.opacity = 0; }, 320);
    setTimeout(strike, 3000 + Math.random() * 6000);
  }
  setTimeout(strike, 1500);
}