const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let currentModal = null;

// const modal = $("#modal");

// $("#open-modal").onclick = function () {
//     modal.classList.add("show");
// };

// $("#modal-close").onclick = function () {
//     modal.classList.remove("show");
// };

// modal.onclick = function (event) {
//     if (event.target === modal) {
//         modal.classList.remove("show");
//     }
// };

// document.addEventListener("keydown", function (event) {
//     if (event.key === "Escape") {
//         modal.classList.remove("show");
//     }
// });

$$("[data-modal]").forEach((btn) => {
    btn.onclick = function () {
        const modal = $(this.dataset.modal);
        if (modal) {
            modal.classList.add("show");
            currentModal = modal;
        } else {
            console.error(`${this.dataset.modal} does not exist`);
        }
    };
});

$$(".modal-close").forEach((btn) => {
    btn.onclick = function () {
        const modal = this.closest(".modal-backdrop");
        if (modal) {
            modal.classList.remove("show");
            currentModal = null;
        }
    };
});

$$(".modal-backdrop").forEach((modal) => {
    modal.onclick = function (event) {
        if (event.target === this) {
            this.classList.remove("show");
            currentModal = null;
        }
    };
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && currentModal) {
        currentModal.classList.remove("show");
        currentModal = null;
    }
});
