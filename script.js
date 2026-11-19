
const videoFile = document.getElementById("videoFile");
const fileInfo = document.getElementById("fileInfo");
const dropArea = document.getElementById("dropArea");
const statusText = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");

let selectedFile = null;
let previewURL = null;

function selectFile(file) {
  if (!file) return;

  const allowedTypes = [
    "video/mp4",
    "video/quicktime",
    "video/webm"
  ];

  if (!allowedTypes.includes(file.type)) {
    statusText.textContent = "Please select an MP4, MOV or WebM video.";
    return;
  }

  if (file.size > 1024 * 1024 * 1024) {
    statusText.textContent = "Please select a video smaller than 1 GB.";
    return;
  }

  selectedFile = file;

  if (previewURL) URL.revokeObjectURL(previewURL);
  previewURL = URL.createObjectURL(file);

  fileInfo.classList.remove("hidden");
  fileInfo.textContent =
    "✓ " + file.name + " · " +
    (file.size / (1024 * 1024)).toFixed(1) + " MB";

  statusText.textContent = "Video selected successfully!";
}

videoFile.addEventListener("change", (event) => {
  selectFile(event.target.files[0]);
});

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("dragging");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragging");
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragging");

  const file = event.dataTransfer.files[0];
  selectFile(file);
});

generateBtn.addEventListener("click", () => {
  const videoUrl = document.getElementById("videoUrl").value.trim();

  if (!selectedFile && !videoUrl) {
    statusText.textContent =
      "Please upload an authorized video or enter its YouTube reference.";
    return;
  }

  if (videoUrl &&
      !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(videoUrl)) {
    statusText.textContent = "Please enter a valid YouTube URL.";
    return;
  }

  const settings = {
    duration: Number(document.getElementById("duration").value),
    clipCount: Number(document.getElementById("clipCount").value),
    captionStyle: document.getElementById("captionStyle").value,
    music: document.getElementById("music").value,
    hooks: document.getElementById("hooks").checked,
    captions: document.getElementById("captions").checked,
    faceTracking: document.getElementById("faceTracking").checked,
    silenceRemoval: document.getElementById("silence").checked,
    effects: document.getElementById("effects").checked
  };

  console.log("ClipForge project settings:", settings);

  statusText.textContent =
    "Your project settings are ready! Connect the Python processing backend to generate actual clips.";

  generateBtn.textContent = "✓ Project settings saved";
});

window.addEventListener("beforeunload", () => {
  if (previewURL) URL.revokeObjectURL(previewURL);
});
