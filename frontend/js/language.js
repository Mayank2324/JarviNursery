let currentTranslations = {};

const modal = document.getElementById("languageModal");

function syncLanguageSwitchers(lang) {
    document.querySelectorAll(".language-switcher").forEach(select => {
        select.value = lang;
    });
}

async function loadLanguage(lang) {
    try {
        const response = await fetch(`languages/${lang}.json`);
        currentTranslations = await response.json();

        translatePage();

        localStorage.setItem("language", lang);

        syncLanguageSwitchers(lang);

        if (modal) {
            modal.style.display = "none";
        }

    } catch (error) {
        console.error("Language loading failed:", error);
    }
}

function translatePage() {

    // Translate normal text
    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (currentTranslations[key]) {
            element.innerHTML = currentTranslations[key];
        }

    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {

        const key = element.getAttribute("data-i18n-placeholder");

        if (currentTranslations[key]) {
            element.placeholder = currentTranslations[key];
        }

    });

}

function openLanguagePopup() {

    if (modal) {
        modal.style.display = "flex";
    }

}

function closeLanguagePopup() {

    if (modal) {
        modal.style.display = "none";
    }

}

document.addEventListener("DOMContentLoaded", () => {

    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {

        syncLanguageSwitchers(savedLanguage);
        loadLanguage(savedLanguage);

    } else {

        syncLanguageSwitchers("en");
        openLanguagePopup();

    }

    document.querySelectorAll(".language-btn").forEach(button => {

        button.addEventListener("click", () => {

            loadLanguage(button.dataset.lang);

        });

    });

    document.querySelectorAll(".language-switcher").forEach(select => {

        select.addEventListener("change", () => {

            loadLanguage(select.value);

        });

    });

});