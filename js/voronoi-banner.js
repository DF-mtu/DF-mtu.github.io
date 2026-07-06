// Interactive Voronoi Viewer simplified for banner
// Requires: d3-delaunay.js @https://d3js.org/d3-delaunay

const canvas = document.getElementById("project2-canvas");
const ctx = canvas.getContext("2d");

const state = {
    points: [],
    pointCount: 16,       // number of random points
    shadow: "enable",
    mouseX: 0, 
    mouseY: 0
};

let needsRender = true;

function requestRender() {
    needsRender = true;
}

function initialize() {
    resizeCanvas();
    registerMouseEvents();
    startRenderLoop();
}
initialize();

function startRenderLoop() {
    function frame() {
        if (needsRender) {
            render();
            needsRender = false;
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function render() {
    clearCanvas();
    drawBackground();
    drawDiagram();
}

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    const oldWidth = canvas.width;
    const newWidth = canvas.clientWidth || window.innerWidth;
    canvas.height = 250; // height should match with banner height

    if (state.points.length === 0) {
        canvas.width = newWidth;
        generateBannerPoints();
    } 
    else {
        const scaleX = newWidth / (oldWidth || newWidth);
        canvas.width = newWidth; 
        
        for (let i = 0; i < state.points.length - 1; i++) {
            state.points[i][0] *= scaleX; 
        }
        
        state.points[state.points.length - 1] = [state.mouseX, state.mouseY];
    }

    requestRender();
}

function generateBannerPoints() {
    state.points = [];
    for (let i = 0; i < state.pointCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        state.points.push([x, y]);
    }
    if (state.mouseX === 0 && state.mouseY === 0) {
        state.mouseX = canvas.width / 2;
        state.mouseY = canvas.height / 2;
    }
    state.points.push([state.mouseX, state.mouseY]);
}

function drawBackground() {
    ctx.fillStyle = "#ffffff42";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDiagram() {
    if (state.points.length < 3) return;

    let delaunay;
    if (typeof d3 !== "undefined" && d3.Delaunay) {
        delaunay = d3.Delaunay.from(state.points);
    } else {
        delaunay = Delaunay.from(state.points);
    }

    drawVoronoi(delaunay);
}

function drawVoronoi(delaunay) {
    const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);

    for (let i = 0; i < state.points.length; i++) {
        const polygon = voronoi.cellPolygon(i);
        if (!polygon) continue;

        ctx.save();

        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        ctx.beginPath();
        ctx.moveTo(polygon[0][0], polygon[0][1]);
        for (let j = 0; j < polygon.length; j++) {
            const px = polygon[j][0];
            const py = polygon[j][1];
            ctx.lineTo(px, py);

            if (px < minX) minX = px;
            if (py < minY) minY = py;
            if (px > maxX) maxX = px;
            if (py > maxY) maxY = py;
        }
        ctx.closePath();
        ctx.fillStyle = getCellColor(i);
        ctx.fill();
            
        if (state.shadow === "enable"){
            ctx.clip();

            const dx = state.points[i][0] - state.mouseX;
            const dy = state.points[i][1] - state.mouseY;

            ctx.shadowOffsetX = dx * 0.05;
            ctx.shadowOffsetY = dy * 0.05;
            ctx.shadowBlur = 15; 
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)"; 
            ctx.beginPath();
            
            const pad = 120;
            ctx.rect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);

            ctx.moveTo(polygon[0][0], polygon[0][1]);
            for (let j = 1; j < polygon.length; j++) {
                ctx.lineTo(polygon[j][0], polygon[j][1]);
            }
            ctx.closePath();

            ctx.fillStyle = "black";
            ctx.fill("evenodd");
            ctx.restore();
        }
    }

    // boundry line
    ctx.beginPath();
    voronoi.render(ctx);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)"; 
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function getCellColor(index){
    const hue = (index * 137.5) % 360;
    return `hsla(${hue}, 65%, 35%, 0.35)`; 
}

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function registerMouseEvents() {
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
}

function onMouseMove(event) {
    const mouse = getMousePosition(event);
    
    state.mouseX = mouse.x;
    state.mouseY = mouse.y;

    if (state.points.length > 0) {
        state.points[state.points.length - 1] = [mouse.x, mouse.y];
    }
    requestRender();
}

function onMouseLeave() {
    state.mouseX = canvas.width / 2;
    state.mouseY = canvas.height / 2;
    if (state.points.length > 0) {
        state.points[state.points.length - 1] = [state.mouseX, state.mouseY];
    }
    requestRender();
}