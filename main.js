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

function Modal(options = {}) {
    const { templateId, destroyOnClose = true, cssClass = [], closeMethods = ["button", "overlay", "escape"] } = options;
    const template = $(`#${templateId}`);

    if (!template) {
        console.error(`Template with id "${templateId}" not found.`);
        return;
    }

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    // Kĩ thuật Cache giá trị
    function getScrollBarWidth() {
        if (getScrollBarWidth.value) {
            return getScrollBarWidth.value;
        }

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

        getScrollBarWidth.value = scrollBarWidth;

        return scrollBarWidth;
    }

    this._build = () => {
        /*
        Vì <template> được thiết kế để chứa nội dung 
        HTML “chưa render”, nên trình duyệt đưa nội dung 
        của nó vào DocumentFragment.
        */

        // Lí do sử dụng cloneNode
        // 1. Để sao chép phần tử mà ko sao chép xử lý sự kiện DOM
        // 2. Để tái sử dụng template nhiều lần
        const content = template.content.cloneNode(true);

        // Create modal elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach((className) => {
            if (typeof className === "string" && className.trim() !== "") {
                container.classList.add(className);
            }
        });

        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.onclick = () => this.close();
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.open = () => {
        if (!this._backdrop) {
            this._build();
        }

        // backdrop
        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Attach event listeners

        if (this._allowBackdropClose) {
            this._backdrop.onclick = (event) => {
                if (event.target === this._backdrop) {
                    this.close();
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    this.close();
                }
            });
        }

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = `${getScrollBarWidth()}px`;

        return this._backdrop;
    };

    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");
        this._backdrop.ontransitionend = () => {
            if (this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
            }

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
        };
    };

    this.destroy = () => {
        this.close(true);
    };
}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
});

$("#open-modal-1").onclick = function () {
    const modalElement = modal1.open();

    // modal1.close();

    const img = modalElement.querySelector("img");
    console.log(img);
};

const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethods: ["button", "overlay", "escape"],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal opened");
    },
    onClose: () => {
        console.log("Modal closed");
    },
});

// modal2.open()
// modal2.close()
// modal2.setFooterContent('HTML string')
// modal2.addFooterButton('Cancel', 'class-1 class-2', (e) => {})
// modal2.addFooterButton('Agree', 'class-3 class-4', (e) => {})
// modal2.destroy()

$("#open-modal-2").onclick = function () {
    const modalElement = modal2.open();

    // modal2.close();

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
