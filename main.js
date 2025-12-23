const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

// let currentModal = null;

// $$("[data-modal]").forEach((btn) => {
//     btn.onclick = function () {
//         const modal = $(this.dataset.modal);
//         if (modal) {
//             modal.classList.add("show");
//             currentModal = modal;
//         } else {
//             console.error(`${this.dataset.modal} does not exist`);
//         }
//     };
// });

// $$(".modal-close").forEach((btn) => {
//     btn.onclick = function () {
//         const modal = this.closest(".modal-backdrop");
//         if (modal) {
//             modal.classList.remove("show");
//             currentModal = null;
//         }
//     };
// });

// $$(".modal-backdrop").forEach((modal) => {
//     modal.onclick = function (event) {
//         if (event.target === this) {
//             this.classList.remove("show");
//             currentModal = null;
//         }
//     };
// });

// document.addEventListener("keydown", function (event) {
//     if (event.key === "Escape" && currentModal) {
//         currentModal.classList.remove("show");
//         currentModal = null;
//     }
// });

function Modal() {
    this.openModal = (options = {}) => {
        const { templateId } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`Template with id "${templateId}" not found.`);
            return;
        }

        const content = template.content.cloneNode(true);

        // Create modal elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;";

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        // backdrop
        setTimeout(() => {
            backdrop.classList.add("show");
        }, 0);

        // Attach event listeners
        closeBtn.onclick = () => this.closeModal(backdrop);

        backdrop.onclick = (event) => {
            if (event.target === backdrop) {
                this.closeModal(backdrop);
            }
        };

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                this.closeModal(backdrop);
            }
        });
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();
        };
    };
}

const modal = new Modal();

$("#open-modal-1").onclick = function () {
    modal.openModal({
        templateId: "modal-1",
    });
};

$("#open-modal-2").onclick = function () {
    modal.openModal({
        templateId: "modal-2",
    });
};
