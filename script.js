// Get references to the canvas and controls
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushType = document.getElementById('brushType');
const saveBtn = document.getElementById('saveBtn');

// Set initial canvas size (full screen)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;

// Drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = "#000000";
let size = 5;
let type = "round";
let drawingHistory = [];

// Set initial brush color and size
colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
});

brushSize.addEventListener('input', (e) => {
    size = e.target.value;
});

brushType.addEventListener('change', (e) => {
    type = e.target.value;
});

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save current drawing state
});

// Draw on the canvas
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const x = e.offsetX;
    const y = e.offsetY;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineJoin = 'round';
    ctx.lineCap = type;
    ctx.stroke();
    
    lastX = x;
    lastY = y;
});

// Clear the canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = []; // Clear history when canvas is cleared
});

// Undo the last drawing action
undoBtn.addEventListener('click', () => {
    if (drawingHistory.length > 0) {
        ctx.putImageData(drawingHistory.pop(), 0, 0); // Revert to the last drawing state
    }
});

// Save the drawing as an image
saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    link.click();
});
