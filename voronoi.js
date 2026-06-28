// Interactive Voronoi / Delaunay Viewer
// Requires: d3-delaunay.js @https://d3js.org/d3-delaunay

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Other UI elements

const modeButton = document.getElementById("modeBtn");
const clearButton = document.getElementById("clearBtn");

// State control

const state = {

    points: [
        [200, 200],
        [400, 150],
        [600, 200],
        [300, 400],
        [500, 400]
    ],

    mode: "voronoi",

    pointRadius: 6,

    hoverIndex: -1,

    draggingIndex: -1,

    isDragging: false,
    
    mouseX: window.innerWidth / 2, 
    mouseY: window.innerHeight / 2

};

let needsRender = true;

function requestRender() {

    needsRender = true;

}


function initialize() {

    resizeCanvas();

    registerUIEvents();

    registerMouseEvents();

    requestRender();

    startRenderLoop();

    if (state.points.length > 0) {
        state.isDragging = true;
        state.draggingIndex = 0; // init drag
    }
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
    drawPoints();
}

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;

    requestRender();
}

function registerUIEvents() {
    modeButton.addEventListener("click", toggleMode);
    clearButton.addEventListener("click", clearPoints);
}


function toggleMode() {
    if (state.mode === "voronoi") {
        state.mode = "delaunay";
        modeButton.textContent = "Delaunay";
    }
    else {
        state.mode = "voronoi";
        modeButton.textContent = "Voronoi";
    }
    requestRender();
}

function clearPoints() {
    state.points = [];
    requestRender();
}

function drawBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function clearCanvas() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function drawDiagram() {

    if (state.points.length < 3) {
        return;
    }

    let delaunay;
    if (typeof d3 !== "undefined" && d3.Delaunay) {
        delaunay = d3.Delaunay.from(state.points);
    } else {
        delaunay = Delaunay.from(state.points);
    }

    if (state.mode === "voronoi") {
        drawVoronoi(delaunay);
    }
    else {
        drawDelaunay(delaunay);
    }
}

function drawDelaunay(delaunay) {

    ctx.beginPath();

    delaunay.render(ctx);

    ctx.strokeStyle = "#000";

    ctx.lineWidth = 1.5;

    ctx.stroke();

}

function drawPoints() {
    for (let i = 0; i < state.points.length; i++) {
        const p = state.points[i];
        // Hover Highlight
        if (i === state.hoverIndex) {
            ctx.beginPath();
            ctx.arc(p[0], p[1], state.pointRadius + 4, 0, Math.PI * 2);
            ctx.fillStyle = "#FFD54F";
            ctx.fill();
        }
        if (state.mode === "voronoi")
        {
            const dx = p[0] - state.mouseX;
            const dy = p[1] - state.mouseY;
            ctx.shadowOffsetX = dx * 0.03; 
            ctx.shadowOffsetY = dy * 0.03;
            ctx.shadowBlur = 15; 
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        }
        // Points
        ctx.beginPath();
        ctx.arc(p[0], p[1], state.pointRadius, 0, Math.PI * 2);
        
        ctx.fillStyle = "#222"; 
        ctx.fill();

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        
        // Index Number
        // ctx.fillStyle = "#1565C0";
        // ctx.font = "12px Arial";
        // ctx.fillText(i, p[0] + 10, p[1] - 10);
    }
}

function distanceSquared(x1, y1, x2, y2) {

    const dx = x1 - x2;
    const dy = y1 - y2;

    return dx * dx + dy * dy;

}

function getMousePosition(event) {

    const rect = canvas.getBoundingClientRect();

    return {

        x: event.clientX - rect.left,
        y: event.clientY - rect.top

    };

}

function registerMouseEvents() {

    canvas.addEventListener("mousedown", onMouseDown);

    canvas.addEventListener("mousemove", onMouseMove);

    window.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("mouseleave", onMouseLeave);
    
    canvas.addEventListener("contextmenu", onContextMenu);

}
let movedDuringDrag = false;

function onMouseDown(event) {

    // only lmb
    if (event.button !== 0)
        return;

    const mouse = getMousePosition(event);

    const index = findPointAt(mouse.x, mouse.y);

    // Start Drag
    if (index !== -1) {

        state.draggingIndex = index;
        state.isDragging = true;
        movedDuringDrag = false;

        return;

    }
    // Create New Point
    state.points.push([mouse.x, mouse.y]);
    requestRender();
}

function onMouseMove(event) {

    const mouse = getMousePosition(event);
    state.mouseX = mouse.x;
    state.mouseY = mouse.y;
    state.hoverIndex = findPointAt(mouse.x, mouse.y);
    if (state.isDragging) {
        movedDuringDrag = true;
        const point = state.points[state.draggingIndex];
        point[0] = mouse.x;
        point[1] = mouse.y;
    }
    if(state.isDragging){
    canvas.style.cursor="none";
    }
    else if(state.hoverIndex!=-1){
        canvas.style.cursor="grab";
    }
    else{
        canvas.style.cursor="crosshair";
    }
    requestRender();
}

function onMouseUp() {
    state.draggingIndex = -1;
    state.isDragging = false;
}

function onMouseLeave() {
    state.hoverIndex = -1;
    requestRender();
}

function findPointAt(x, y) {
    const radius =
        state.pointRadius + 5;
    const radiusSquared =
        radius * radius;
    for (let i = state.points.length - 1; i >= 0; i--) {
        const p = state.points[i];
        if (
            distanceSquared(
                x,
                y,

                p[0],
                p[1]
            ) < radiusSquared
        ) {
            return i;
        }
    }
    return -1;
}

// rmb
function onContextMenu(event) {
    // block context menu
    event.preventDefault(); 

    const mouse = getMousePosition(event);
    const index = findPointAt(mouse.x, mouse.y);
    if (index !== -1) {
        state.points.splice(index, 1);
        if (state.hoverIndex === index) state.hoverIndex = -1;
        if (state.draggingIndex === index) {
            state.draggingIndex = -1;
            state.isDragging = false;
        }
        requestRender();
    }
}

const polygon = voronoi.cellPolygon(i);

// Voronoi
function drawVoronoi(delaunay) {
    const voronoi = delaunay.voronoi([
        0, 0, canvas.width, canvas.height
    ]);

    // Inner shadow
    for (let i = 0; i < state.points.length; i++) {
    const polygon = voronoi.cellPolygon(i);
    if (!polygon) continue;

    ctx.save();

    // Bounding Box
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
    ctx.clip();

    const dx = state.points[i][0] - state.mouseX;
    const dy = state.points[i][1] - state.mouseY;

    ctx.shadowOffsetX = dx * 0.05;
    ctx.shadowOffsetY = dy * 0.05;
    ctx.shadowBlur = 10; 
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.beginPath();
    
    // boundry shadow pad
    const pad = 120;
    ctx.rect(minX - pad, minY - pad, (maxX - minX) + pad * 2, (maxY - minY) + pad * 2);

    // polygon voids
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let j = 1; j < polygon.length; j++) {
        ctx.lineTo(polygon[j][0], polygon[j][1]);
    }
    ctx.closePath();

    ctx.fillStyle = "black";
    ctx.fill("evenodd");

    ctx.restore();
    }

    // boundry
    ctx.beginPath();
    voronoi.render(ctx);
    ctx.strokeStyle = "rgba(0,0,0,0.4)"; 
    ctx.lineWidth = 9.5;
    ctx.stroke();
}

function getCellColor(index){
    const hue = index*137.5%360;
    return `hsla(
        ${hue},
        75%,
        50%,
        0.6
    )`;
}
