const URL = "https://teachablemachine.withgoogle.com/models/pX0onAg0Ie/"; // <-- Replace with your model URL
let model, maxPredictions;

const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const classifyButton = document.getElementById('classifyButton');
const breedList = document.getElementById('breedList');
const loadingSpinner = document.getElementById('loadingSpinner');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to initialize the Teachable Machine model
async function init() {
    loadingSpinner.style.display = 'block'; // Show loading spinner
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Teachable Machine model loaded successfully!");
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    } catch (error) {
        console.error("Error loading Teachable Machine model:", error);
        loadingSpinner.style.display = 'none'; // Hide loading spinner
        alert("Failed to load AI model. Please check the URL and your internet connection.");
    }
}

// Function to handle image upload
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block'; // Show the image
            classifyButton.disabled = false; // Enable classify button
            breedList.innerHTML = ''; // Clear previous results
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImage.style.display = 'none';
        uploadedImage.src = "#";
        classifyButton.disabled = true;
        breedList.innerHTML = '';
    }
});

// Function to classify the uploaded image
classifyButton.addEventListener('click', async function() {
    if (!model) {
        alert("AI model is not loaded yet. Please wait a moment or refresh the page.");
        return;
    }
    if (uploadedImage.style.display === 'none' || uploadedImage.src === '#') {
        alert("Please upload an image first.");
        return;
    }

    loadingSpinner.style.display = 'block'; // Show loading spinner
    breedList.innerHTML = ''; // Clear previous results

    // Draw image to canvas to ensure correct input format for model
    canvas.width = uploadedImage.naturalWidth;
    canvas.height = uploadedImage.naturalHeight;
    ctx.drawImage(uploadedImage, 0, 0);

    const prediction = await model.predict(canvas); // Predict using the canvas element

    loadingSpinner.style.display = 'none'; // Hide loading spinner

    // Sort predictions by probability in descending order
    prediction.sort((a, b) => b.probability - a.probability);

    // Display prediction results
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<span>${prediction[i].className}</span> <strong>${(prediction[i].probability * 100).toFixed(2)}%</strong>`;
        breedList.appendChild(listItem);
    }
});

// Initialize the model when the page loads
window.onload = init;