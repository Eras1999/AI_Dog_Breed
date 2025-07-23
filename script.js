const URL = "https://teachablemachine.withgoogle.com/models/pX0onAg0Ie/";
let model, maxPredictions;

const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const classifyButton = document.getElementById('classifyButton');
const breedList = document.getElementById('breedList');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const predictionResults = document.getElementById('predictionResults');
const noObjectDetected = document.getElementById('noObjectDetected');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Teachable Machine model loaded successfully!");
    } catch (error) {
        console.error("Error loading Teachable Machine model:", error);
        alert("Failed to load AI model. Please check the URL and your internet connection.");
    }
}

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            imagePreviewContainer.classList.remove('hidden');
            classifyButton.disabled = false;
            breedList.innerHTML = '';
            predictionResults.classList.add('hidden');
            noObjectDetected.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        imagePreviewContainer.classList.add('hidden');
        uploadedImage.src = "#";
        classifyButton.disabled = true;
        breedList.innerHTML = '';
    }
});

classifyButton.addEventListener('click', async function() {
    if (!model) {
        alert("AI model is not loaded yet. Please wait a moment or refresh the page.");
        return;
    }
    if (imagePreviewContainer.classList.contains('hidden') || uploadedImage.src === '#') {
        alert("Please upload an image first.");
        return;
    }

    breedList.innerHTML = '<p>Detecting...</p>';
    predictionResults.classList.remove('hidden');
    noObjectDetected.classList.add('hidden');

    canvas.width = uploadedImage.naturalWidth;
    canvas.height = uploadedImage.naturalHeight;
    ctx.drawImage(uploadedImage, 0, 0);

    try {
        const prediction = await model.predict(canvas);
        breedList.innerHTML = '';

        prediction.sort((a, b) => b.probability - a.probability);

        if (prediction.length > 0) {
            const topPrediction = prediction[0];
            const confidence = (topPrediction.probability * 100).toFixed(2);
            breedList.innerHTML = `
                <p>Breed: <strong>${topPrediction.className}</strong></p>
                <p>Confidence: ${confidence}%</p>
            `;
        } else {
            predictionResults.classList.add('hidden');
            noObjectDetected.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        breedList.innerHTML = '<p style="color: red;">Error detecting breed. Please try again.</p>';
    }
});

window.onload = init;