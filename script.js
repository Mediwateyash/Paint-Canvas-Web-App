const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = window.innerWidth - 300;  // Adjust width according to sidebar
canvas.height = window.innerHeight - 100;  // Adjust height

let painting = false;
let erasing = false;
let brushSize = 5;
let brushType = 'round';
let brushColor = '#000000';
let startX = 0;
let startY = 0;
let currentShape = 'free';  // Default shape is 'free' drawing
let undoStack = [];
let shapes = [];

// Function to start drawing
function startPosition(e) {
    painting = true;
    startX = e.offsetX;
    startY = e.offsetY;
}

// Function to stop drawing
function stopPosition() {
    painting = false;
    if (currentShape !== 'free') {
        undoStack.push(canvas.toDataURL());
        shapes.push({ shape: currentShape, x: startX, y: startY, size: brushSize, color: brushColor, endX: startX, endY: startY });
    }
    ctx.beginPath();
}

// Function to draw on canvas (free drawing or shapes)
function draw(e) {
    if (!painting) return;
    if (erasing) {
        ctx.globalCompositeOperation = 'destination-out';  // Eraser mode
    } else {
        ctx.globalCompositeOperation = 'source-over';  // Drawing mode
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = brushType;
    ctx.strokeStyle = brushColor;

    if (currentShape === 'free') {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else {
        let width, height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas to redraw all shapes
        drawShapes();
        if (currentShape === 'circle') {
            let radius = Math.abs(startX - e.offsetX);
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (currentShape === 'rectangle') {
            width = e.offsetX - startX;
            height = e.offsetY - startY;
            ctx.rect(startX, startY, width, height);
            ctx.stroke();
        } else if (currentShape === 'line') {
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    }
}

// Function to draw all shapes (from shapes array)
function drawShapes() {
    shapes.forEach(shapeObj => {
        ctx.lineWidth = shapeObj.size;
        ctx.strokeStyle = shapeObj.color;
        if (shapeObj.shape === 'circle') {
            ctx.beginPath();
            let radius = Math.abs(shapeObj.x - shapeObj.endX);
            ctx.arc(shapeObj.x, shapeObj.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shapeObj.shape === 'rectangle') {
            let width = shapeObj.endX - shapeObj.x;
            let height = shapeObj.endY - shapeObj.y;
            ctx.beginPath();
            ctx.rect(shapeObj.x, shapeObj.y, width, height);
            ctx.stroke();
        } else if (shapeObj.shape === 'line') {
            ctx.beginPath();
            ctx.moveTo(shapeObj.x, shapeObj.y);
            ctx.lineTo(shapeObj.endX, shapeObj.endY);
            ctx.stroke();
        }
    });
}

// Event listeners
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', stopPosition);
canvas.addEventListener('mousemove', draw);

// Set brush size from the slider
document.getElementById('brushSize').addEventListener('input', function(e) {
    brushSize = e.target.value;
});

// Set brush type from the dropdown
document.getElementById('brushType').addEventListener('change', function(e) {
    brushType = e.target.value;
});

// Set brush color from color picker
document.getElementById('colorPicker').addEventListener('input', function(e) {
    brushColor = e.target.value;
});

// Shape selection
document.getElementById('drawCircle').addEventListener('click', function() {
    currentShape = 'circle';
});

document.getElementById('drawRectangle').addEventListener('click', function() {
    currentShape = 'rectangle';
});

document.getElementById('drawLine').addEventListener('click', function() {
    currentShape = 'line';
});

// Eraser tool
document.getElementById('eraserBtn').addEventListener('click', function() {
    erasing = !erasing;
    if (erasing) {
        document.getElementById('eraserBtn').style.backgroundColor = "#f44336"; // Eraser active
    } else {
        document.getElementById('eraserBtn').style.backgroundColor = "#ffeb3b"; // Eraser inactive
    }
});

// Clear canvas
document.getElementById('clearBtn').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoStack = [];  // Clear undo history
    shapes = [];     // Clear drawn shapes
});

// Undo last action
document.getElementById('undoBtn').addEventListener('click', function() {
    if (undoStack.length > 0) {
        let lastState = undoStack.pop();
        let img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
        img.src = lastState;
    }
});

// Save canvas as image
document.getElementById('saveBtn').addEventListener('click', function() {
    let link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'paint-drawing.png';
    link.click();
});
