// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.getElementById('camera');
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing the camera: ", err);
    });

let countdownStarted = false;  // Flag to ensure countdown starts only once

// function isFullBodyInView(poses, canvasElementwidth, canvasElementheight) {
//     if (poses && poses.length > 0) {
//         const keypoints = poses[0].keypoints;
//         const requiredKeypoints = [0, 5, 6, 9, 10, 11, 12, 15, 16];  // nose, shoulders, wrists, hips, ankles

//         // Ensure all required keypoints are detected with a score above a threshold
//         const allKeypointsDetected = requiredKeypoints.every(index => {
//             const kp = keypoints[index];

//             console.log(kp);
//             console.log(kp.score);
            
//             return (kp.score > 0.4) && (kp.x > 0) && (kp.y > 0);  // && (kp.x < canvasElementwidth) && (kp.y < canvasElementheight);
//         });

//         // console.log(allKeypointsDetected);
//         return allKeypointsDetected;
//     }
//     return false;
// }

// function startCountdown(seconds) {
//     const countdownElement = document.getElementById('countdown');
//     let counter = seconds;
//     const intervalId = setInterval(() => {
//         countdownElement.innerText = `Game starts in: ${counter}`;
//         console.log("countdown started");
//         counter--;
//         if (counter < 0) {
//             clearInterval(intervalId);
//             countdownElement.innerText = '';
//             startGame();
//         }
//     }, 1000);
// }

// function startGame() {
//     console.log("Game started!");
//     // createDetector();
// }

// // Periodically check if the player is in the correct position
// setInterval(() => {
//     if (isFullBodyInView()) {
//         startCountdown(5); // Start a 5-second countdown
//     }
// }, 1000); // Check every second as an example

// function checkForFullBodyAndStart() {
//     setupWebcam().then(videoElement => {
//         videoElement.play();

//         const model = poseDetection.SupportedModels.MoveNet;
//         const detectorConfig = {
//             modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
//         };

//         poseDetection.createDetector(model, detectorConfig).then(detector => {
//             const canvasElement = document.getElementById('output');
//             const ctx = canvasElement.getContext('2d');

//             const runPoseDetection = () => {
//                 ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//                 detector.estimatePoses(videoElement).then(poses => {
//                     console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

//                     if (isFullBodyInView(poses, canvasElement.width, canvasElement.height) && !countdownStarted) {
//                         countdownStarted = true;
//                         startCountdown(5);
//                         createDetector();
//                     }

//                     requestAnimationFrame(runPoseDetection);
//                 });
//             };

//             runPoseDetection();

//         }).catch(error => {
//             console.error('Error creating detector:', error);
//         });
//     }).catch(error => {
//         console.error('Error setting up webcam:', error);
//     });
// }

function setupWebcam() {
    const webcamElement = document.getElementById('camera');
    return navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        webcamElement.srcObject = stream;
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                resolve(webcamElement);
            };
        });
    }).catch(error => {
        console.error('Error accessing the webcam:', error);
    });
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

    const runPoseDetection2 = async () => {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        const poses = await detector.estimatePoses(videoElement);

        console.log(poses[0]); 

        // if (isFullBodyInView(poses) && !countdownStarted) {
        //     countdownStarted = true; 
        //     startCountdown(5);
        // }
        
         // Draw keypoints         
        if (poses && poses.length > 0) {
            poses[0].keypoints.forEach(drawKeypoint);

            plank(poses[0].keypoints);
            // burpee(poses[0].keypoints);
            // jumpJack(poses[0].keypoints);
        }
        
        requestAnimationFrame(runPoseDetection2); // Continuously run pose detection
    };

    runPoseDetection2();

    const drawKeypoint = (keypoint) => {         
        const { x, y, score } = keypoint;         
            if (score > 0.3) {         
                const mirroredX = canvasElement.width - x;
                
                ctx.beginPath();             
                ctx.arc(x, y, 5, 0, 2 * Math.PI);             
                ctx.fillStyle = "aqua";             
                ctx.fill();
            }     
    };

    var score = 0;
    
    function plank(array){

        for (let i = 0; i < array.length; i++) {
            // var output = console.log("hiiiiiiiiiiiiiiiiiiiiiiii");

            // array 15 and 16 are L and R ankles
            //array 9 and 10 are L and R wrists
            if ((array[9].y >= 400 && array[10].y >= 400) && (array[15].score < 0.30 && array[16].score < 0.30)){
                score += 1;
                console.log("plank score increased by 1");
            }
        }
        return true;
    }

    function burpee(array) {
        var jump = 0;
        var down = 0;
    
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
        return true;
    }

    
    // function jumpJack(array){
    //     var armDown = 0;
    //     var ankleOut = 0;
    //     var ankleIn = 0;
    //     var clap = 0;

    //     for (let i = 0; armDown <= 10 && ankleOut <= 10 && ankleIn <= 10 && clap <= 10; i++){
    //         var jackDone = console.log("burpee function done");
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

// checkForFullBodyAndStart();
createDetector();