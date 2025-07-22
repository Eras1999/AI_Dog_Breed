const URL = "model/";
let model, imageElement;

async function loadModel() {
  try {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    console.log("Model loaded");
  } catch (err) {
    alert("Model failed to load. Check folder path or file names.");
    console.error(err);
  }
}
loadModel();

document.getElementById("imageUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    document.getElementById("preview").innerHTML = "";
    document.getElementById("preview").appendChild(img);
    imageElement = img;
    document.getElementById("predictBtn").disabled = false;
  };
});

document.getElementById("predictBtn").addEventListener("click", async function () {
  if (!model || !imageElement) return;

  const predictions = await model.predict(imageElement);
  predictions.sort((a, b) => b.probability - a.probability);

  const top = predictions[0];
  document.getElementById("result").innerText = `Predicted: ${top.className} (${(top.probability * 100).toFixed(2)}%)`;

  let list = "<ul class='list-group mt-3'>";
  predictions.forEach(p => {
    list += `<li class="list-group-item d-flex justify-content-between">
      ${p.className}
      <span>${(p.probability * 100).toFixed(2)}%</span>
    </li>`;
  });
  list += "</ul>";

  document.getElementById("probabilities").innerHTML = list;
});
