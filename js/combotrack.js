// ComboTrack – history-aware combo-box widget
// Depends on: getCookie, setCookie, referenceFromString, showParagraphFromComboEntry

const MAX_ITEMS = 25;

let comboOptions = [];
let visibleOptions = [];
let activeIndex = -1;
let comboTrackInitialized = false;

function initComboTrack() {
    if (comboTrackInitialized) return;
    const input    = document.getElementById('mytrackCombo');
    const dropdown = document.getElementById('mytrackComboOptions');
    const prevBtn  = document.getElementById('mytrackComboPrev');
    const nextBtn  = document.getElementById('mytrackComboNext');

    if (!input || !dropdown || !prevBtn || !nextBtn) return;
    comboTrackInitialized = true;

    rebuildCollectionFromCookie();
    updateOptionsDisplay();
    dropdown.style.display = 'none';

    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (value) addNewEntryOption(value);
        } else {
            filterOptions(input.value);
        }
    });

    input.addEventListener('blur', () => {
        setTimeout(() => { dropdown.style.display = 'none'; }, 200);
    });

    input.addEventListener('focus', () => {
        if (comboOptions.length > 0) dropdown.style.display = 'block';
    });

    prevBtn.addEventListener('click', () => {
        navigateVisibleOptions(-1);
        input.focus();
    });

    nextBtn.addEventListener('click', () => {
        navigateVisibleOptions(1);
        input.focus();
    });

    // Remove Bootstrap modal backdrop when the paragraph modal is dismissed.
    const modalEl = document.getElementById('modalText');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
            document.querySelector('.modal-backdrop')?.remove();
        });
    }
}

function saveCollectionToCookie() {
    setCookie('suggestionsData', JSON.stringify(comboOptions), 180);
}

function rebuildCollectionFromCookie() {
    const value = getCookie('suggestionsData');
    if (!value) return;
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) comboOptions = parsed;
    } catch (e) {
        console.error('Error parsing combo cookie:', e);
    }
}

function addNewEntryOption(newEntry) {
    if (!newEntry) return;
    const ref   = referenceFromString(newEntry);
    const entry = `${ref.paper}:${ref.section}-${ref.paragraph}`;
    if (comboOptions.length > 0 && comboOptions[comboOptions.length - 1] === entry) return;

    comboOptions.push(entry);
    while (comboOptions.length > MAX_ITEMS) comboOptions.shift();

    showParagraphFromComboEntry(entry);
    updateOptionsDisplay();

    const input = document.getElementById('mytrackCombo');
    if (input) input.value = '';

    const dropdown = document.getElementById('mytrackComboOptions');
    if (dropdown) dropdown.style.display = 'none';
}

function updateOptionsDisplay() {
    const dropdown = document.getElementById('mytrackComboOptions');
    if (!dropdown) return;

    visibleOptions = [...comboOptions].reverse();
    activeIndex = visibleOptions.length > 0 ? 0 : -1;
    renderOptions(dropdown, visibleOptions);
    dropdown.style.display = comboOptions.length > 0 ? 'block' : 'none';
    saveCollectionToCookie();
}

function filterOptions(filterText) {
    const dropdown = document.getElementById('mytrackComboOptions');
    if (!dropdown) return;

    if (!filterText.trim()) {
        updateOptionsDisplay();
        return;
    }

    const lower = filterText.toLowerCase();
    visibleOptions = [...comboOptions]
        .reverse()
        .filter(o => o.toLowerCase().includes(lower));
    activeIndex = visibleOptions.length > 0 ? 0 : -1;
    renderOptions(dropdown, visibleOptions);
    dropdown.style.display = visibleOptions.length > 0 ? 'block' : 'none';
}

function renderOptions(dropdown, optionsToRender) {
    dropdown.innerHTML = '';
    optionsToRender.forEach((option, index) => {
        const div = document.createElement('div');
        div.textContent = option;
        if (index === activeIndex) div.classList.add('active-option');
        div.addEventListener('click', () => {
            setActiveOption(index, true);
            dropdown.style.display = 'none';
        });
        dropdown.appendChild(div);
    });
}

function setActiveOption(index, shouldNavigate) {
    if (!visibleOptions.length || index < 0 || index >= visibleOptions.length) return;
    activeIndex = index;
    const selected = visibleOptions[activeIndex];

    const input = document.getElementById('mytrackCombo');
    if (input) input.value = selected;

    const dropdown = document.getElementById('mytrackComboOptions');
    if (dropdown) renderOptions(dropdown, visibleOptions);

    if (shouldNavigate) showParagraphFromComboEntry(selected);
}

function navigateVisibleOptions(step) {
    const input = document.getElementById('mytrackCombo');
    if (!visibleOptions.length) {
        const filterText = input?.value?.trim() || '';
        if (filterText) {
            filterOptions(filterText);
        } else {
            updateOptionsDisplay();
        }
    }
    if (!visibleOptions.length) return;

    if (activeIndex < 0) {
        activeIndex = 0;
    } else {
        activeIndex = (activeIndex + step + visibleOptions.length) % visibleOptions.length;
    }
    setActiveOption(activeIndex, true);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComboTrack);
} else {
    initComboTrack();
}

