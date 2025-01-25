// Get references to the canvas and controls
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const colorPicker = document.getElementById('colorPicker');

// Set initial canvas size
canvas.width = 600;
canvas.height = 400;

// Track if the user is drawing
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let color = "#000000";

// Set the drawing color based on the color picker
colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
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
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    
    lastX = x;
    lastY = y;
});

// Clear the canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
