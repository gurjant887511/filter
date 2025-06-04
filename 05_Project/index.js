let originalImage = new Image();
const canvas = document.getElementById('enhancedImage');
const ctx = canvas.getContext('2d');

function loadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            document.getElementById('originalImage').src = e.target.result; // Changed from 'original huomImage'
            originalImage.onload = function() {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                applyFilters();
            };
        };
        reader.readAsDataURL(file);
    }
}

function applyFilters() {
    const brightness = parseInt(document.getElementById('brightness').value);
    const contrast = parseInt(document.getElementById('contrast').value);
    const sharpness = parseFloat(document.getElementById('sharpness').value);
    const effect = document.getElementById('effectSelect').value;

    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);

    // Apply canvas filter if applicable
    if (['grayscale', 'sepia', 'invert', 'blur', 'brightness', 'contrast', 'saturate', 'hue-rotate'].includes(effect)) {
        let filterString = '';
        switch (effect) {
            case 'grayscale': filterString = 'grayscale(100%)'; break;
            case 'sepia': filterString = 'sepia(100%)'; break;
            case 'invert': filterString = 'invert(100%)'; break;
            case 'blur': filterString = 'blur(5px)'; break;
            case 'brightness': filterString = 'brightness(150%)'; break;
            case 'contrast': filterString = 'contrast(150%)'; break;
            case 'saturate': filterString = 'saturate(200%)'; break;
            case 'hue-rotate': filterString = 'hue-rotate(90deg)'; break;
        }
        ctx.filter = filterString;
        ctx.drawImage(originalImage, 0, 0);
        ctx.filter = 'none';
    }

    // Apply custom effects requiring pixel manipulation
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    if (['vintage', 'posterize', 'solarize', 'threshold', 'emboss', 'edge', 'warm', 'cool', 'dreamy', 'retro', 
         'cartoon', 'oil-painting', 'glow', 'sketch', 'vibrance', 'faded', 'cross-process', 'lomo', 'negative', 
         'soft-focus', 'duotone', 'pop-art', 'monochrome', 'high-key', 'low-key'].includes(effect)) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(canvas, 0, 0);
        const src = tempCtx.getImageData(0, 0, w, h).data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                let r = src[idx];
                let g = src[idx + 1];
                let b = src[idx + 2];

                if (effect === 'vintage') {
                    r = r * 0.9 + 20;
                    g = g * 0.7 + 30;
                    b = b * 0.5 + 40;
                } else if (effect === 'posterize') {
                    r = Math.floor(r / 64) * 64;
                    g = Math.floor(g / 64) * 64;
                    b = Math.floor(b / 64) * 64;
                } else if (effect === 'solarize') {
                    r = r > 128 ? 255 - r : r;
                    g = g > 128 ? 255 - g : g;
                    b = b > 128 ? 255 - b : b;
                } else if (effect === 'threshold') {
                    const avg = (r + g + b) / 3;
                    const val = avg > 128 ? 255 : 0;
                    r = g = b = val;
                } else if (effect === 'emboss') {
                    const nextIdx = ((y * w + (x + 1)) * 4) % (w * h * 4);
                    r = src[nextIdx] - src[idx] + 128;
                    g = src[nextIdx + 1] - src[idx + 1] + 128;
                    b = src[nextIdx + 2] - src[idx + 2] + 128;
                } else if (effect === 'edge') {
                    const nextIdx = ((y * w + (x + 1)) * 4) % (w * h * 4);
                    r = Math.abs(src[nextIdx] - src[idx]) * 2;
                    g = Math.abs(src[nextIdx + 1] - src[idx + 1]) * 2;
                    b = Math.abs(src[nextIdx + 2] - src[idx + 2]) * 2;
                } else if (effect === 'warm') {
                    r = r * 1.2;
                    g = g * 0.8;
                    b = b * 0.6;
                } else if (effect === 'cool') {
                    r = r * 0.6;
                    g = g * 0.8;
                    b = b * 1.2;
                } else if (effect === 'dreamy') {
                    r = r + 20 > 255 ? 255 : r + 20;
                    g = g + 20 > 255 ? 255 : g + 20;
                    b = b + 40 > 255 ? 255 : b + 40;
                } else if (effect === 'retro') {
                    r = r * 0.8 + 20;
                    g = g * 0.9 + 10;
                    b = b * 0.7;
                } else if (effect === 'cartoon') {
                    const avg = (r + g + b) / 3;
                    r = avg > 128 ? Math.min(255, r * 1.5) : r * 0.5;
                    g = avg > 128 ? Math.min(255, g * 1.5) : g * 0.5;
                    b = avg > 128 ? Math.min(255, b * 1.5) : b * 0.5;
                } else if (effect === 'oil-painting') {
                    const bin = Math.floor(r / 32) * 32;
                    r = g = b = bin;
                } else if (effect === 'glow') {
                    r = r + 30 > 255 ? 255 : r + 30;
                    g = g + 30 > 255 ? 255 : g + 30;
                    b = b + 30 > 255 ? 255 : b + 30;
                } else if (effect === 'sketch') {
                    const avg = (r + g + b) / 3;
                    r = g = b = avg > 128 ? 255 : 0;
                    const nextIdx = ((y * w + (x + 1)) * 4) % (w * h * 4);
                    r += Math.abs(src[nextIdx] - src[idx]);
                } else if (effect === 'vibrance') {
                    const avg = (r + g + b) / 3;
                    const max = Math.max(r, g, b);
                    r += (max - r) * 0.5;
                    g += (max - g) * 0.5;
                    b += (max - g) * 0.5;
                } else if (effect === 'faded') {
                    r = r * 0.6 + 50;
                    g = g * 0.6 + 50;
                    b = b * 0.6 + 50;
                } else if (effect === 'cross-process') {
                    r = r * 1.1;
                    g = g * 0.9;
                    b = b * 1.2 + 20;
                } else if (effect === 'lomo') {
                    r = r * 1.1 + 10;
                    g = g * 0.9;
                    b = b * 0.8;
                } else if (effect === 'negative') {
                    r = 255 - r;
                    g = 255 - g;
                    b = 255 - b;
                } else if (effect === 'soft-focus') {
                    r = r * 0.8 + 40;
                    g = g * 0.8 + 40;
                    b = b * 0.8 + 40;
                } else if (effect === 'duotone') {
                    const avg = (r + g + b) / 3;
                    r = avg;
                    g = 0;
                    b = avg;
                } else if (effect === 'pop-art') {
                    r = r > 128 ? 255 : 0;
                    g = g > 128 ? 255 : 0;
                    b = b > 128 ? 255 : 0;
                } else if (effect === 'monochrome') {
                    const avg = (r + g + b) / 3;
                    r = g = b = avg;
                } else if (effect === 'high-key') {
                    r = r + 50 > 255 ? 255 : r + 50;
                    g = g + 50 > 255 ? 255 : g + 50;
                    b = b + 50 > 255 ? 255 : b + 50;
                } else if (effect === 'low-key') {
                    r = r * 0.5;
                    g = g * 0.5;
                    b = b * 0.5;
                } else if (effect === 'rainbow') {
                    const angle = (x + y) * (Math.PI / 180);
                    r = r * (Math.sin(angle) + 1) / 2;
                    g = g * (Math.cos(angle) + 1) / 2;
                    b = b * (Math.sin(angle + Math.PI/2) + 1) / 2;
                } else if (effect === 'cyberpunk') {
                    r = r > 128 ? r + 50 : r - 50;
                    b = b > 128 ? b + 80 : b - 80;
                    g = g * 0.8;
                } else if (effect === 'matrix') {
                    r = g;
                    b = g;
                    g = g > 128 ? 255 : 0;
                } else if (effect === 'glitch') {
                    if (Math.random() > 0.95) {
                        r = 255 - r;
                        g = 255 - g;
                        b = 255 - b;
                    }
                } else if (effect === 'pixelate') {
                    const pixelSize = 8;
                    const px = Math.floor(x / pixelSize) * pixelSize;
                    const py = Math.floor(y / pixelSize) * pixelSize;
                    const pixelIndex = (py * w + px) * 4;
                    r = src[pixelIndex];
                    g = src[pixelIndex + 1];
                    b = src[pixelIndex + 2];
                } else if (effect === 'watercolor') {
                    const radius = 2;
                    let rSum = 0, gSum = 0, bSum = 0, count = 0;
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            const sourceX = x + dx;
                            const sourceY = y + dy;
                            if (sourceX >= 0 && sourceX < w && sourceY >= 0 && sourceY < h) {
                                const sourceIndex = (sourceY * w + sourceX) * 4;
                                rSum += src[sourceIndex];
                                gSum += src[sourceIndex + 1];
                                bSum += src[sourceIndex + 2];
                                count++;
                            }
                        }
                    }
                    r = rSum / count;
                    g = gSum / count;
                    b = bSum / count;
                } else if (effect === 'neon') {
                    const threshold = 100;
                    const intensity = 2;
                    if (Math.abs(r - g) > threshold || Math.abs(g - b) > threshold || Math.abs(b - r) > threshold) {
                        r = Math.min(255, r * intensity);
                        g = Math.min(255, g * intensity);
                        b = Math.min(255, b * intensity);
                    }
                } else if (effect === 'halftone') {
                    const size = 4;
                    const value = (r + g + b) / 3;
                    const pattern = Math.floor((value / 255) * size * size);
                    r = g = b = (x % size + Math.floor(y / size) * size < pattern) ? 255 : 0;
                } else if (effect === 'cosmic') {
                    const t = Date.now() / 1000;
                    r = r * (Math.sin(x * 0.01 + t) + 1) / 2;
                    g = g * (Math.sin(y * 0.01 + t) + 1) / 2;
                    b = b * (Math.cos((x + y) * 0.01 + t) + 1) / 2;
                } else if (effect === 'underwater') {
                    r = r * 0.7;
                    g = g * 0.9;
                    b = b * 1.2;
                    const waveFactor = Math.sin(y * 0.1) * 2;
                    const srcX = Math.min(Math.max(0, x + waveFactor), w - 1);
                    const srcIdx = (y * w + Math.floor(srcX)) * 4;
                    r = src[srcIdx];
                    g = src[srcIdx + 1];
                    b = src[srcIdx + 2];
                }

                data[idx] = Math.min(255, Math.max(0, r));
                data[idx + 1] = Math.min(255, Math.max(0, g));
                data[idx + 2] = Math.min(255, Math.max(0, b));
            }
        }
    }

    // Apply Snapchat/Instagram-like effects
    if (['panda-stickers', 'cat-hood', 'heart-sticker', 'my-day-hands'].includes(effect)) {
        // Panda Stickers: Simulate panda ears with circles and color adjustment
        if (effect === 'panda-stickers') {
            // Apply a slight sepia tone to mimic the filter's vibe
            ctx.filter = 'sepia(30%)';
            ctx.drawImage(originalImage, 0, 0);
            ctx.filter = 'none';

            // Simulate panda ears with black and white circles
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(w * 0.3, h * 0.2, w * 0.05, 0, Math.PI * 2); // Left ear
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w * 0.7, h * 0.2, w * 0.05, 0, Math.PI * 2); // Right ear
            ctx.fill();

            // White patches around eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(w * 0.4, h * 0.3, w * 0.05, 0, Math.PI * 2); // Left eye patch
            ctx.fill();
            ctx.beginPath();
            ctx.arc(w * 0.6, h * 0.3, w * 0.05, 0, Math.PI * 2); // Right eye patch
            ctx.fill();
        }

        // Cat Hood: Add a "meow" text overlay and a slight warm filter
        if (effect === 'cat-hood') {
            // Apply a warm filter
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            const src = tempCtx.getImageData(0, 0, w, h).data;

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    let r = src[idx];
                    let g = src[idx + 1];
                    let b = src[idx + 2];

                    r = r * 1.1;
                    g = g * 0.9;
                    b = b * 0.8;

                    data[idx] = Math.min(255, Math.max(0, r));
                    data[idx + 1] = Math.min(255, Math.max(0, g));
                    data[idx + 2] = Math.min(255, Math.max(0, b));
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // Add "meow" text
            ctx.font = `${w * 0.05}px Arial`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('meow', w * 0.5, h * 0.4);
        }

        // Heart Sticker: Add a heart shape on the cheek area
        if (effect === 'heart-sticker') {
            // Draw a heart shape
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(w * 0.65, h * 0.35);
            ctx.bezierCurveTo(w * 0.65, h * 0.32, w * 0.63, h * 0.30, w * 0.60, h * 0.30);
            ctx.bezierCurveTo(w * 0.57, h * 0.30, w * 0.55, h * 0.32, w * 0.55, h * 0.35);
            ctx.bezierCurveTo(w * 0.55, h * 0.38, w * 0.57, h * 0.40, w * 0.60, h * 0.40);
            ctx.bezierCurveTo(w * 0.63, h * 0.40, w * 0.65, h * 0.38, w * 0.65, h * 0.35);
            ctx.closePath();
            ctx.fill();
        }

        // My Day Hands: Add "my day" text with a heart emoji
        if (effect === 'my-day-hands') {
            // Apply a slight brightness increase
            ctx.filter = 'brightness(120%)';
            ctx.drawImage(originalImage, 0, 0);
            ctx.filter = 'none';

            // Add "my day" text with a heart
            ctx.font = `${w * 0.05}px Arial`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'right';
            ctx.fillText('- my day ❤️', w * 0.95, h * 0.9);
        }
    }

    // Brightness and Contrast Adjustment
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128 + brightness));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128 + brightness));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128 + brightness));
    }

    // Apply sharpness
    if (sharpness > 1) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);

        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;

        const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const weightSum = weights.reduce((a, b) => a + b, 0) || 1;
        const side = Math.round(Math.sqrt(weights.length));
        const halfSide = Math.floor(side / 2);

        const src = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const dstOff = (y * w + x) * 4;
                let r = 0, g = 0, b = 0;

                for (let cy = 0; cy < side; cy++) {
                    for (let cx = 0; cx < side; cx++) {
                        const scy = y + cy - halfSide;
                        const scx = x + cx - halfSide;
                        if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                            const srcOff = (scy * w + scx) * 4;
                            const wt = weights[cy * side + cx] * sharpness;
                            r += src[srcOff] * wt;
                            g += src[srcOff + 1] * wt;
                            b += src[srcOff + 2] * wt;
                        }
                    }
                }

                data[dstOff] = Math.min(255, Math.max(0, r / weightSum));
                data[dstOff + 1] = Math.min(255, Math.max(0, g / weightSum));
                data[dstOff + 2] = Math.min(255, Math.max(0, b / weightSum));
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function reduceNoise() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);

    const src = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const w = canvas.width;
    const h = canvas.height;

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            let r = 0, g = 0, b = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const srcIdx = ((y + dy) * w + (x + dx)) * 4;
                    r += src[srcIdx];
                    g += src[srcIdx + 1];
                    b += src[srcIdx + 2];
                }
            }

            data[idx] = r / 9;
            data[idx + 1] = g / 9;
            data[idx + 2] = b / 9;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'enhanced-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Event listeners for live updates
document.getElementById('brightness').addEventListener('input', applyFilters);
document.getElementById('contrast').addEventListener('input', applyFilters);
document.getElementById('sharpness').addEventListener('input', applyFilters);
document.getElementById('effectSelect').addEventListener('change', applyFilters);