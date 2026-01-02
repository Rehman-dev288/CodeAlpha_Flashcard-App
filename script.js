// --- Data & State ---
let cards = []; 
let currentCardIndex = 0;
let isEditing = false;

// --- Elements ---
const mainContentEl = document.getElementById('main-flashcard-content');
const emptyStateEl = document.getElementById('empty-state');

const cardEl = document.getElementById('card');
const questionEl = document.getElementById('display-question');
const answerEl = document.getElementById('display-answer');
const cardCountEl = document.getElementById('card-count');
const progressFill = document.getElementById('progress-fill');
const resetBtn = document.getElementById('reset-deck');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const modal = document.getElementById('modal');
const inputQuestion = document.getElementById('input-question');
const inputAnswer = document.getElementById('input-answer');
const saveBtn = document.getElementById('save-card-btn');
// New Modal Header Elements
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalIcon = document.getElementById('modal-icon');

const deleteModal = document.getElementById('delete-modal');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateCardDisplay();
    setupInputValidation();
});

// --- Core Functions ---
function updateCardDisplay() {
    if (cards.length === 0) {
        mainContentEl.classList.add('hidden');
        emptyStateEl.classList.remove('hidden');
        resetBtn.style.display = 'none';
        return;
    }

    mainContentEl.classList.remove('hidden');
    emptyStateEl.classList.add('hidden');
    resetBtn.style.display = 'flex';

    cardEl.classList.remove('is-flipped');
    
    setTimeout(() => {
        if (currentCardIndex >= cards.length) currentCardIndex = 0;
        const currentCard = cards[currentCardIndex];
        questionEl.textContent = currentCard.question;
        answerEl.textContent = currentCard.answer;
        
        cardCountEl.textContent = `Card ${currentCardIndex + 1} of ${cards.length}`;
        const progressPercent = ((currentCardIndex + 1) / cards.length) * 100;
        progressFill.style.width = `${progressPercent}%`;
        updateNavigationState();
    }, 150); 
}

function updateNavigationState() {
    if (cards.length === 0) return;
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex === cards.length - 1;
}

// --- Flip Logic ---
document.getElementById('show-answer').addEventListener('click', () => cardEl.classList.add('is-flipped'));
document.getElementById('show-question').addEventListener('click', () => cardEl.classList.remove('is-flipped'));

// --- Navigation Logic ---
prevBtn.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCardDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        updateCardDisplay();
    }
});

// --- Reset Deck ---
resetBtn.addEventListener('click', () => {
    if (cards.length > 0) {
        cards = [];
        currentCardIndex = 0;
        updateCardDisplay();
        showToast("Reset successfully. All cards deleted.", "success");
    }
});

// --- Modal & Input Validation Logic ---

document.getElementById('header-add-btn').addEventListener('click', openAddModal);
document.getElementById('center-add-btn').addEventListener('click', openAddModal);

function openAddModal() {
    isEditing = false;
    // Update Modal UI for Adding
    modalTitle.textContent = "Create New Flashcard";
    modalSubtitle.textContent = "Add a new question and answer to your study deck.";
    modalIcon.className = "fas fa-plus"; // Plus icon
    saveBtn.innerHTML = `<span>Save Card</span>`;

    inputQuestion.value = "";
    inputAnswer.value = "";
    validateInputs(); 
    openModal();
}

function editCurrentCard() {
    if (cards.length === 0) return;
    isEditing = true;
    // Update Modal UI for Editing
    modalTitle.textContent = "Edit Flashcard";
    modalSubtitle.textContent = "Update the question and answer for this flashcard.";
    modalIcon.className = "far fa_edit"; // Pencil icon
    saveBtn.innerHTML = `<i class="far fa-edit"></i> <span>Save Changes</span>`;

    inputQuestion.value = cards[currentCardIndex].question;
    inputAnswer.value = cards[currentCardIndex].answer;
    validateInputs();
    openModal();
}

function openModal() {
    modal.classList.add('show');
    setTimeout(() => inputQuestion.focus(), 100);
}

function closeModal() {
    modal.classList.remove('show');
}

function setupInputValidation() {
    inputQuestion.addEventListener('input', validateInputs);
    inputAnswer.addEventListener('input', validateInputs);
}

function validateInputs() {
    const q = inputQuestion.value.trim();
    const a = inputAnswer.value.trim();
    saveBtn.disabled = (q.length === 0 || a.length === 0);
}

saveBtn.addEventListener('click', () => {
    const question = inputQuestion.value.trim();
    const answer = inputAnswer.value.trim();

    if (!question || !answer) return;

    if (isEditing) {
        cards[currentCardIndex] = { question, answer };
        showToast("Card updated successfully!", "success");
    } else {
        cards.push({ question, answer });
        currentCardIndex = cards.length - 1;
        showToast("Card added successfully!", "success");
    }

    updateCardDisplay();
    closeModal();
});

// --- Delete Logic ---
function confirmDelete() {
    if (cards.length === 0) return;
    deleteModal.classList.add('show');
}

function closeDeleteModal() {
    deleteModal.classList.remove('show');
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    cards.splice(currentCardIndex, 1);
    if (currentCardIndex >= cards.length && currentCardIndex > 0) {
        currentCardIndex--;
    }
    updateCardDisplay();
    closeDeleteModal();
    showToast("Card deleted successfully", "error");
});

// --- Toast Notification ---
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-trash"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Dark Mode Toggle ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    }
});