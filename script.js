const { startIndicesWithElidedDims } = require("@tensorflow/tfjs-core/dist/ops/slice_util");

// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById('camera');
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
    });

  
function isFullBodyInView(poses) {
    if (poses && poses.length > 0) {
        return true; 
    } return false;
}

function startCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    let counter = seconds;

    if (isFullBodyInView == true){
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
}

function startGame() {
    // Game starts
    // Implement game logic here
    console.log("Game started!");
}

// // Periodically check if the player is in the correct position
// setInterval(() => {
//     if (isFullBodyInView()) {
//         startCountdown(5); // Start a 5-second countdown
//     }
// }, 1000); // Check every second

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
    };
    const detector = await poseDetection.createDetector(model, detectorConfig);     
    
    const canvasElement = document.getElementById('output'); // Getting the canvas element
    const ctx = canvasElement.getContext('2d'); // Getting the 2D rendering context

    const runPoseDetection = async () => {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const poses = await detector.estimatePoses(videoElement);
        console.log(poses[0]); 

        isFullBodyInView(poses);
        
         // Draw keypoints         
        if (poses && poses.length > 0) {
            poses[0].keypoints.forEach(drawKeypoint);

            startCountdown(5);

            plank(poses[0].keypoints);
            // burpee(poses[0].keypoints);
            // jumpJack(poses[0].keypoints);
        }
        
        requestAnimationFrame(runPoseDetection); // Continuously run pose detection
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
    var exercise_complete = false
    
    function plank(array){
        exercise_complete = false

        for (let i = 0; score >= 10; i++) {
            // var output = console.log("hiiiiiiiiiiiiiiiiiiiiiiii");

            // array 15 and 16 are L and R ankles
            //array 9 and 10 are L and R wrists
            if ((array[9].y >= 400 && array[10].y >= 400) && (array[15].score < 0.30 && array[16].score < 0.30)){
                score += 1;
                console.log("score increased by 1");
            }

            if (i == 15 && score < 10){
                console.log("you plank failure");
                exercise_complete = false
                return exercise_complete;
            }
        }
        exercise_complete = true
        return exercise_complete;
    }

    function burpee(array) {
        var jump = 0;
        var down = 0;
        exercise_complete = false
    
        // Add a limit to the number of iterations
        const maxIterations = 50;
    
        for (let i = 0; i < maxIterations && jump <= 10 && down <= 10; i++) {
            console.log("Checking burpee conditions");
    
            // Make sure keypoints exist and have a 'y' property
            if (array[15] && array[16] && array[9] && array[10]) {
                if (array[15].y < 400 && array[16].y < 400) {
                    jump += 1;
                    console.log("burpee jump score increased by 1");
                }
    
                if (array[9].y >= 400 && array[10].y >= 400) {
                    down += 1;
                    console.log("burpee pushup score increased by 1");
                }
            } else {
                console.log("Keypoint data missing or incomplete");
                break;
            }
    
            if (jump > 10 || down > 10) {
                console.log("you burpee failure");
                return false;
            }
        }
    
        console.log("burpee function done");

        exercise_complete = true

        return exercise_complete;
    }

    
    // function jumpJack(array){
    //     var armDown = 0;
    //     var ankleOut = 0;
    //     var ankleIn = 0;
    //     var clap = 0;
    //     exercise_complete = false

    //     for (let i = 0; armDown <= 10 && ankleOut <= 10 && ankleIn <= 10 && clap <= 10; i++){
            
    //         // wrists
    //         if(array[9] <= 150 && array[10] <= 150){
    //             clap += 1;
    //             console.log("jump jack clap score increased by 1");
    //         }
    //         if(array[9] >= 300 && array[10] >= 300){
    //             armDown += 1;
    //             console.log("jump jack arm down score increased by 1");
    //         }
    //         if(array[15] <= 300 && array[16] <= 300){
    //             ankleOut += 1;
    //             console.log("jump jack ankle out score increased by 1");
    //         }
    //     }
    // }

}
createDetector();