// Setup Canvas
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 240;  // Adjust for controls width
canvas.height = window.innerHeight;

// Variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = 5;
let brushType = 'round';
let brushColor = '#000000';
let drawingShape = null;
let eraserMode = false;

// Setup Brush Size and Color
document.getElementById('brushSize').addEventListener('input', (e) => {
    brushSize = e.target.value;
});

document.getElementById('brushType').addEventListener('change', (e) => {
    brushType = e.target.value;
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

// Start Drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    if (eraserMode) {
        // Eraser Logic
        ctx.clearRect(e.offsetX - brushSize / 2, e.offsetY - brushSize / 2, brushSize, brushSize);
    } else if (drawingShape) {
        // Drawing Shapes Logic
        drawShape(e);
    } else {
        // Drawing Freehand
        draw(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
    ctx.beginPath();
});

// Freehand Drawing Function
function draw(e) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = brushType;
    ctx.strokeStyle = brushColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

// Shape Drawing Function
function drawShape(e) {
    const width = e.offsetX - lastX;
    const height = e.offsetY - lastY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas before drawing
    ctx.beginPath();
    if (drawingShape === 'circle') {
        ctx.arc(lastX, lastY, Math.sqrt(width * width + height * height), 0, Math.PI * 2);
    } else if (drawingShape === 'rectangle') {
        ctx.rect(lastX, lastY, width, height);
    } else if (drawingShape === 'line') {
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
    }
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
}

// Shape Button Click Events
document.getElementById('drawCircle').addEventListener('click', () => {
    drawingShape = 'circle';
});

document.getElementById('drawRectangle').addEventListener('click', () => {
    drawingShape = 'rectangle';
});

document.getElementById('drawLine').addEventListener('click', () => {
    drawingShape = 'line';
});

// Eraser Tool Logic
document.getElementById('eraserBtn').addEventListener('click', () => {
    eraserMode = !eraserMode;
    if (eraserMode) {
        document.getElementById('eraserBtn').textContent = 'Disable Eraser';
    } else {
        document.getElementById('eraserBtn').textContent = 'Enable Eraser';
    }
});

// Clear Canvas
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Undo Functionality (to be implemented if needed)
document.getElementById('undoBtn').addEventListener('click', () => {
    // You can add an undo stack to support this functionality
    console.log('Undo function not yet implemented');
});

// Save Drawing
document.getElementById('saveBtn').addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'drawing.png';
    link.click();
});
