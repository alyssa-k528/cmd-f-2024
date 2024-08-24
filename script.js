// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById('camera');
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
    });

function isFullBodyInView() {
    // Placeholder for full body detection logic
    // Returns true if a full body is detected, false otherwise
    return true; // Replace with actual detection logic
}
function startCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    let counter = seconds;
    const intervalId = setInterval(() => {
        countdownElement.innerText = `Game starts in: ${counter}`;
        counter--;
        if (counter < 0) {
            clearInterval(intervalId);
            countdownElement.innerText = '';
            startGame();
        }
    }, 1000);
}
function startGame() {
    // Game starts
    // Implement game logic here
    console.log("Game started!");
}
// Periodically check if the player is in the correct position
setInterval(() => {
    if (isFullBodyInView()) {
        startCountdown(5); // Start a 5-second countdown
    }
}, 1000); // Check every second as an example

async function setupWebcam() {
    const webcamElement = document.getElementById('camera');
    webcamElement.onloadedmetadata = () => {
        canvasElement.width = webcamElement.videoWidth;
        canvasElement.height = webcamElement.videoHeight;
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
        webcamElement.srcObject = stream;
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                resolve(webcamElement);
            };
        });
    } catch (error) {
        console.error('Error accessing the webcam:', error);
    }
}

async function createDetector() {
    const videoElement = await setupWebcam();
    videoElement.play();
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        // Other configuration options
    };
    const detector = await poseDetection.createDetector(model, detectorConfig);     
    
    const canvasElement = document.getElementById('output'); // Getting the canvas element
    const ctx = canvasElement.getContext('2d'); // Getting the 2D rendering context

    const runPoseDetection = async () => {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const poses = await detector.estimatePoses(videoElement);
        console.log(poses[0]); 
        
         // Draw keypoints         
        if (poses && poses.length > 0) {
            poses[0].keypoints.forEach(drawKeypoint);
            plank(poses[0].keypoints);
        }
        // You might want to draw the results on the video or process them further
        // ...
        requestAnimationFrame(runPoseDetection); // Continuously run pose detection
        // return poses;
    };

    runPoseDetection();

    const drawKeypoint = (keypoint) => {         
        const { x, y, score } = keypoint;         
            if (score > 0.3) {         
                const mirroredX = canvasElement.width - x;
                
                ctx.beginPath();             
                ctx.arc(x, y, 5, 0, 2 * Math.PI);             
                ctx.fillStyle = "aqua";             
                ctx.fill();
                //console.log("hiiiiiiiiiiiiiiiiiiii");   

                // const stopWatch = new Date();
                // let totalTime = 0;
                // let startTime = Date.now();

                // function updateTimer() {
                //     let currentTime = Date.now();
                //     totalTime += (currentTime - startTime) / 1000; // Convert to seconds
                //     startTime = currentTime;
                //     console.log(totalTime);

                //     if (totalTime <= 10) {
                //         setTimeout(updateTimer, 100); // Update every 100ms
                //     }
                // }

                // updateTimer();

            }     
    };

    var score = 0;
    
    function plank(array){

        for (let i = 0; i < array.length; i++) {
            var output = console.log("hiiiiiiiiiiiiiiiiiiiiiiii");
            // array 15 and 16 are L and R ankles
            //array 9 and 10 are L and R wrists
            if ((array[9].y >= 400 && array[10].y >= 400) && (array[15].score < 0.30 && array[16].score < 0.30)){
                score += 1;
                console.log("score increased by 1");
            }
        }

        return output;
    }

    // function burpee(array){
    //     z
    // }

}
createDetector();