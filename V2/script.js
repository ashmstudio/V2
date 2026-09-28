(() => {
  "use strict";

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d", { alpha: false });
  const state = { width: 0, height: 0, dpr: 1, nodes: [], sparks: [] };
  const palette = { green: "#79ff9a", lime: "#39d878", dim: "#174f31", red: "#ff4f52" };
  const random = (min, max) => min + Math.random() * (max - min);

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    state.width = bounds.width;
    state.height = bounds.height;
    canvas.width = Math.floor(bounds.width * state.dpr);
    canvas.height = Math.floor(bounds.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildScene();
    draw();
  }

  function buildScene() {
    const { width, height } = state;
    state.nodes = Array.from({ length: width < 700 ? 26 : 48 }, (_, index) => ({
      x: width * random(.18, .96), y: height * random(.08, .92), radius: random(1, 2.8), red: index % 13 === 0
    }));
    state.sparks = Array.from({ length: width < 700 ? 50 : 90 }, () => ({
      x: width * random(.1, 1), y: height * random(.04, .96), size: random(.4, 1.7), red: Math.random() > .91
    }));
  }

  function drawBase() {
    const { width, height } = state;
    context.fillStyle = "#010302";
    context.fillRect(0, 0, width, height);
    const glow = context.createRadialGradient(width * .68, height * .5, 0, width * .68, height * .5, width * .7);
    glow.addColorStop(0, "rgba(8, 65, 32, .5)");
    glow.addColorStop(.42, "rgba(3, 28, 15, .34)");
    glow.addColorStop(1, "rgba(1, 3, 2, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
  }

  function drawGrid() {
    const { width, height } = state;
    context.strokeStyle = "rgba(65, 208, 111, .065)";
    context.lineWidth = 1;
    for (let x = width * .12; x < width; x += 44) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
    for (let y = 24; y < height; y += 44) { context.beginPath(); context.moveTo(width * .12, y); context.lineTo(width, y); context.stroke(); }
    context.strokeStyle = "rgba(75, 225, 120, .16)";
    for (let x = width * .08; x < width * .38; x += 86) {
      const y = height * random(.16, .84);
      context.beginPath(); context.moveTo(x, y); context.lineTo(x + 27, y); context.lineTo(x + 27, y + 30); context.lineTo(x + 66, y + 30); context.stroke();
      context.fillStyle = palette.green; context.fillRect(x + 64, y + 28, 3, 3);
    }
  }

  function drawArchitecture() {
    const { width, height } = state;
    const coreX = width * .7;
    const coreY = height * .5;
    const frame = Math.min(width, height) * .38;
    context.lineWidth = 1;
    context.strokeStyle = "rgba(77, 231, 123, .14)";
    context.beginPath();
    context.moveTo(coreX - frame, coreY - frame * .62);
    context.lineTo(coreX - frame * .72, coreY - frame * .62);
    context.lineTo(coreX - frame * .53, coreY - frame * .82);
    context.moveTo(coreX + frame, coreY + frame * .62);
    context.lineTo(coreX + frame * .72, coreY + frame * .62);
    context.lineTo(coreX + frame * .53, coreY + frame * .82);
    context.stroke();

    context.strokeStyle = "rgba(65, 210, 109, .1)";
    context.beginPath();
    context.moveTo(width * .22, height * .08);
    context.lineTo(width * .43, height * .08);
    context.lineTo(width * .53, height * .18);
    context.moveTo(width * .18, height * .88);
    context.lineTo(width * .39, height * .88);
    context.lineTo(width * .49, height * .78);
    context.stroke();

    context.setLineDash([2, 9]);
    context.strokeStyle = "rgba(111, 255, 149, .2)";
    context.beginPath();
    context.arc(coreX, coreY, frame * 1.16, -Math.PI * .2, Math.PI * .42);
    context.stroke();
    context.setLineDash([]);

    context.strokeStyle = "rgba(255, 79, 82, .42)";
    context.beginPath();
    context.moveTo(coreX + frame * .86, coreY - frame * .46);
    context.lineTo(coreX + frame * .98, coreY - frame * .33);
    context.lineTo(coreX + frame * .88, coreY - frame * .2);
    context.moveTo(coreX - frame * .95, coreY + frame * .31);
    context.lineTo(coreX - frame * 1.04, coreY + frame * .42);
    context.lineTo(coreX - frame * .92, coreY + frame * .52);
    context.stroke();
  }

  function drawDetailLayers() {
    const { width, height } = state;
    const coreX = width * .7;
    const coreY = height * .5;

    context.strokeStyle = "rgba(76, 219, 117, .065)";
    context.lineWidth = 1;
    const hexSize = Math.min(width, height) * .075;
    for (let row = -2; row < 9; row += 1) {
      for (let column = 0; column < 9; column += 1) {
        const x = width * .48 + column * hexSize * 1.72 + (row % 2) * hexSize * .86;
        const y = row * hexSize * 1.48 - hexSize;
        context.beginPath();
        for (let side = 0; side < 6; side += 1) {
          const angle = side * Math.PI / 3;
          const pointX = x + Math.cos(angle) * hexSize * .45;
          const pointY = y + Math.sin(angle) * hexSize * .45;
          side === 0 ? context.moveTo(pointX, pointY) : context.lineTo(pointX, pointY);
        }
        context.closePath();
        context.stroke();
      }
    }

    context.strokeStyle = "rgba(75, 226, 119, .12)";
    context.beginPath();
    context.moveTo(width * .05, height * .27); context.lineTo(width * .16, height * .27); context.lineTo(width * .19, height * .23);
    context.moveTo(width * .05, height * .72); context.lineTo(width * .15, height * .72); context.lineTo(width * .18, height * .76);
    context.moveTo(width * .87, height * .16); context.lineTo(width * .95, height * .16); context.lineTo(width * .98, height * .2);
    context.stroke();

    context.fillStyle = "rgba(61, 218, 108, .18)";
    context.fillRect(width * .08, height * .41, width * .12, 2);
    context.fillRect(width * .08, height * .42, width * .07, 1);
    context.fillRect(width * .08, height * .59, width * .17, 2);
    context.fillStyle = "rgba(255, 79, 82, .62)";
    context.fillRect(width * .08, height * .41, width * .035, 2);
    context.fillRect(width * .08, height * .59, width * .018, 2);

    context.strokeStyle = "rgba(255, 79, 82, .26)";
    context.beginPath();
    context.arc(coreX, coreY, Math.min(width, height) * .34, Math.PI * .72, Math.PI * 1.05);
    context.stroke();
    context.strokeStyle = "rgba(93, 242, 132, .28)";
    context.beginPath();
    context.arc(coreX, coreY, Math.min(width, height) * .34, -Math.PI * .18, Math.PI * .18);
    context.stroke();

    const halo = Math.min(width, height) * .31;
    context.strokeStyle = "rgba(110, 255, 151, .26)";
    context.beginPath();
    for (let tick = 0; tick < 24; tick += 1) {
      const angle = tick * Math.PI / 12;
      const inner = halo - (tick % 3 === 0 ? 10 : 5);
      context.moveTo(coreX + Math.cos(angle) * inner, coreY + Math.sin(angle) * inner);
      context.lineTo(coreX + Math.cos(angle) * halo, coreY + Math.sin(angle) * halo);
    }
    context.stroke();

    context.strokeStyle = "rgba(80, 224, 123, .13)";
    context.beginPath();
    for (let point = 0; point < 8; point += 1) {
      const angle = point * Math.PI / 4 + Math.PI / 8;
      const outer = halo * 1.22;
      const pointX = coreX + Math.cos(angle) * outer;
      const pointY = coreY + Math.sin(angle) * outer;
      point === 0 ? context.moveTo(pointX, pointY) : context.lineTo(pointX, pointY);
    }
    context.closePath();
    context.stroke();

    context.strokeStyle = "rgba(76, 229, 121, .11)";
    context.beginPath();
    context.moveTo(width * .24, height * .04); context.lineTo(width * .38, height * .2); context.lineTo(width * .43, height * .2);
    context.moveTo(width * .28, height * .96); context.lineTo(width * .44, height * .78); context.lineTo(width * .53, height * .78);
    context.moveTo(width * .92, height * .3); context.lineTo(width * .82, height * .39); context.lineTo(width * .79, height * .39);
    context.stroke();

    context.fillStyle = "rgba(255, 79, 82, .58)";
    context.beginPath();
    context.moveTo(coreX + halo * .96, coreY + halo * .32);
    context.lineTo(coreX + halo * 1.08, coreY + halo * .42);
    context.lineTo(coreX + halo * 1.02, coreY + halo * .49);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(coreX - halo * .9, coreY - halo * .55);
    context.lineTo(coreX - halo * 1.01, coreY - halo * .64);
    context.lineTo(coreX - halo * .94, coreY - halo * .72);
    context.closePath();
    context.fill();
  }

  function drawNetwork() {
    const { width, nodes } = state;
    context.lineWidth = 1;
    nodes.forEach((node, index) => {
      let linked = 0;
      nodes.forEach((other, otherIndex) => {
        if (otherIndex <= index || linked > 1) return;
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < width * .16) {
          context.strokeStyle = `rgba(52, 194, 98, ${Math.max(.06, .21 - distance / width)})`;
          context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(other.x, other.y); context.stroke(); linked += 1;
        }
      });
    });
    nodes.forEach((node) => {
      context.fillStyle = node.red ? palette.red : palette.green;
      context.globalAlpha = node.red ? .8 : .58;
      context.beginPath(); context.arc(node.x, node.y, node.radius, 0, Math.PI * 2); context.fill();
      context.globalAlpha = 1;
    });
  }

  function drawCore() {
    const { width, height } = state;
    const centerX = width * .7;
    const centerY = height * .5;
    const radius = Math.min(width, height) * .25;
    context.save();
    context.translate(centerX, centerY);
    context.strokeStyle = "rgba(91, 239, 128, .22)";
    context.lineWidth = 1;
    [radius, radius * .73, radius * .45].forEach((ring) => { context.beginPath(); context.arc(0, 0, ring, 0, Math.PI * 2); context.stroke(); });
    context.rotate(Math.PI / 6);
    context.strokeStyle = "rgba(108, 255, 148, .62)";
    context.beginPath();
    for (let side = 0; side < 6; side += 1) { const angle = side * Math.PI / 3; const x = Math.cos(angle) * radius * .36; const y = Math.sin(angle) * radius * .36; side === 0 ? context.moveTo(x, y) : context.lineTo(x, y); }
    context.closePath(); context.stroke();
    context.beginPath(); context.moveTo(-radius * .36, 0); context.lineTo(radius * .36, 0); context.moveTo(0, -radius * .36); context.lineTo(0, radius * .36); context.stroke();
    context.restore();
    const coreGlow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * .33);
    coreGlow.addColorStop(0, "rgba(155, 255, 173, .5)"); coreGlow.addColorStop(.28, "rgba(42, 219, 103, .18)"); coreGlow.addColorStop(1, "rgba(11, 77, 36, 0)");
    context.fillStyle = coreGlow; context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    context.fillStyle = palette.red; context.globalAlpha = .8; context.beginPath(); context.arc(centerX + radius * .8, centerY - radius * .32, 3, 0, Math.PI * 2); context.fill(); context.globalAlpha = 1;
  }

  function drawSparks() {
    state.sparks.forEach((spark) => { context.fillStyle = spark.red ? palette.red : palette.lime; context.globalAlpha = spark.red ? .65 : .38; context.fillRect(spark.x, spark.y, spark.size, spark.size); });
    context.globalAlpha = 1;
  }

  function draw() { drawBase(); drawGrid(); drawDetailLayers(); drawArchitecture(); drawSparks(); drawNetwork(); drawCore(); }

  window.addEventListener("resize", resize, { passive: true });
  resize();
})();
