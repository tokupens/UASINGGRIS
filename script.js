// --- DATA GAMBAR ---
const images = {
    1: {
        src: "images/GKB.jpeg",
        caption: "Pict 1: Joint Lecture Building, Cilacap State Polytechnic.",
        thumbLabel: "Pict 1 (GKB) selected."
    },
    2: {
        src: "images/GTIL.jpeg",
        caption: "Pict 2: GTIL Building.",
        thumbLabel: "Pict 2 (GTIL) selected."
    },
    3: {
        src: "images/CANTEEN.jpeg",
        caption: "Pict 3: Campus Canteen.",
        thumbLabel: "Pict 3 (Canteen) selected."
    }
};

// --- DOM ELEMENT ---
const mainImage = document.getElementById("mainImage");
const mainCaption = document.getElementById("mainCaption");
const thumbCaption = document.getElementById("thumbCaption");
const imgButtons = document.querySelectorAll(".img-btn");

// FORM ELEMENT
const nameInput = document.getElementById("name");
const storyInput = document.getElementById("story");
const sendBtn = document.getElementById("sendBtn");

// STORY GALLERY
const storiesList = document.getElementById("storiesList");
const emptyText = document.getElementById("emptyText");
const orderSelect = document.getElementById("orderSelect");

let currentImageId = 1;

// Tidak pakai localStorage → story hilang saat refresh
let stories = [];
let likeHistory = {};


// --- SET DEFAULT IMAGE (Fix awal blank) ---
function setDefaultImage() {
    mainImage.src = images[1].src;
    mainCaption.textContent = images[1].caption;
    thumbCaption.textContent = images[1].thumbLabel;
}
setDefaultImage();


// --- GANTI GAMBAR ---
imgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        imgButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const id = btn.dataset.id;
        currentImageId = id;

        mainImage.src = images[id].src;
        mainCaption.textContent = images[id].caption;
        thumbCaption.textContent = images[id].thumbLabel;

        renderStories();
    });
});


// --- KIRIM STORY ---
sendBtn.addEventListener("click", () => {
    const name = nameInput.value.trim() || "Anonymous";
    const text = storyInput.value.trim();

    if (text === "") {
        alert("Please write a story first.");
        return;
    }

    const newStory = {
        id: Date.now(),
        name,
        text,
        imageId: currentImageId,
        likes: 0
    };

    stories.push(newStory);

    nameInput.value = "";
    storyInput.value = "";

    renderStories();
});


// --- LIKE STORY ---
function likeStory(id) {
    if (likeHistory[id]) return;
    likeHistory[id] = true;

    const story = stories.find(s => s.id === id);
    if (story) story.likes++;

    renderStories();
}


// --- DELETE STORY ---
function deleteStory(id) {
    stories = stories.filter(s => s.id !== id);
    renderStories();
}


// --- RENDER STORY ---
function renderStories() {
    const filtered = stories.filter(s => s.imageId == currentImageId);

    if (filtered.length === 0) {
        storiesList.innerHTML = "";
        emptyText.style.display = "block";
        return;
    }

    emptyText.style.display = "none";

    if (orderSelect.value === "liked") {
        filtered.sort((a, b) => b.likes - a.likes);
    } else {
        filtered.sort((a, b) => b.id - a.id);
    }

    storiesList.innerHTML = "";

    filtered.forEach(story => {
        const card = document.createElement("div");
        card.className = "story-card";

        card.innerHTML = `
            <div class="story-meta">
                <span class="story-author">${story.name}</span>
            </div>

            <div class="story-text">${story.text}</div>

            <div style="margin-top:8px;">
                <button class="btn-like" onclick="likeStory(${story.id})"
                    ${likeHistory[story.id] ? "disabled" : ""}>
                    ❤️ Like
                </button>

                <span class="likes-info">${story.likes} likes</span>

                <button class="btn-like" style="margin-left:10px;background:#ccc;color:#333;"
                    onclick="deleteStory(${story.id})">
                    🗑 Delete
                </button>
            </div>
        `;

        storiesList.appendChild(card);
    });
}


// --- EVENT: CHANGE ORDER ---
orderSelect.addEventListener("change", renderStories);

// LOAD AWAL
renderStories();
