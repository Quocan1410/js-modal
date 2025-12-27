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
        /*
        Vì <template> được thiết kế để chứa nội dung 
        HTML “chưa render”, nên trình duyệt đưa nội dung 
        của nó vào DocumentFragment.
        */
        const { templateId, allowBackdropClose = true } = options;
        const template = $(`#${templateId}`);

        if (!template) {
            console.error(`Template with id "${templateId}" not found.`);
            return;
        }

        // Lí do sử dụng cloneNode
        // 1. Để sao chép phần tử mà ko sao chép xử lý sự kiện DOM
        // 2. Để tái sử dụng template nhiều lần
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

        if (allowBackdropClose) {
            backdrop.onclick = (event) => {
                if (event.target === backdrop) {
                    this.closeModal(backdrop);
                }
            };
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                this.closeModal(backdrop);
            }
        });

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = `${getScrollBarWidth()}px`;

        return backdrop;
    };

    this.closeModal = (modalElement) => {
        modalElement.classList.remove("show");
        modalElement.ontransitionend = () => {
            modalElement.remove();

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };
    };
}

const modal = new Modal();

$("#open-modal-1").onclick = function () {
    const modalElement = modal.openModal({
        templateId: "modal-1",
    });

    const img = modalElement.querySelector("img");
    console.log(img);
};

$("#open-modal-2").onclick = function () {
    const modalElement = modal.openModal({
        templateId: "modal-2",
        allowBackdropClose: false,
    });

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = function (event) {
            event.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};

function getScrollBarWidth() {
    // Create a temporary div element
    const div = document.createElement("div");
    Object.assign(div.style, {
        overflowY: "scroll",
        position: "absolute",
        top: "-9999px",
    });
    document.body.appendChild(div);

    // Calculate the scrollbar width
    const scrollBarWidth = div.offsetWidth - div.clientWidth;

    // Remove the temporary div element
    document.body.removeChild(div);

    return scrollBarWidth;
}
