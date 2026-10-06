document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       INTRO
    ========================== */

    const intro = document.getElementById("intro");
    const creator = document.getElementById("creator");
    const mainSite = document.getElementById("main-site");


    setTimeout(() => {

        intro.classList.add("hide");

        setTimeout(() => {

            creator.classList.add("show");

        }, 400);

    }, 5000);


    setTimeout(() => {

        mainSite.classList.add("show");

    }, 7000);


    /* =========================
       PERIODIC TABLE
    ========================== */

    const table = document.getElementById(
        "periodic-table-grid"
    );

    const searchInput = document.getElementById(
        "element-search"
    );


    let elements = [];


    /*
     * دریافت اطلاعات از Express API
     */

    async function loadElements() {

        try {

            const response = await fetch(
                "/api/elements"
            );


            if (!response.ok) {

                throw new Error(
                    "خطا در دریافت عناصر"
                );

            }


            elements = await response.json();

            renderPeriodicTable(elements);

        } catch (error) {

            console.error(error);

            table.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align:center;
                    padding:50px;
                    color:#e99b9b;
                ">
                    خطا در دریافت اطلاعات عناصر
                </div>
            `;

        }

    }


    /*
     * تبدیل category فارسی
     * به کلاس CSS
     */

    function getCategoryClass(category) {

    const categories = {

        "نافلز":
            "nonmetal",

        "گاز نجیب":
            "noble-gas",

        "فلز قلیایی":
            "alkali-metal",

        "فلز قلیایی خاکی":
            "alkaline-earth",

        "شبه‌فلز":
            "metalloid",

        "هالوژن":
            "halogen",

        "فلز واسطه":
            "transition-metal",

        "فلز پس‌واسطه":
            "post-transition-metal",

        "لانتانید":
            "lanthanide",

        "اکتینید":
            "actinide"

    };


    return categories[category] || "nonmetal";

}
    

function renderPeriodicTable(data) {

    table.innerHTML = "";


    /*
     * لانتانیدها و اکتینیدها
     * باید در دو ردیف جدا نمایش داده شوند.
     */

    const lanthanides = data.filter(
        element =>
            element.atomicNumber >= 58 &&
            element.atomicNumber <= 71
    );


    const actinides = data.filter(
        element =>
            element.atomicNumber >= 90 &&
            element.atomicNumber <= 103
    );


    /*
     * عناصر جدول اصلی
     *
     * لانتانیدها و اکتینیدها
     * از جدول اصلی خارج می‌شوند.
     */

    const mainElements = data.filter(
        element =>
            !(
                element.atomicNumber >= 58 &&
                element.atomicNumber <= 71
            ) &&
            !(
                element.atomicNumber >= 90 &&
                element.atomicNumber <= 103
            )
    );


    /*
     * ساخت کارت عنصر
     */

    function createElementCard(element) {

        const card =
            document.createElement("button");


        card.className =
            `element ${getCategoryClass(
                element.category
            )}`;


        /*
         * ستون بر اساس گروه
         */

        card.style.gridColumn =
            element.group;


        /*
         * ردیف بر اساس دوره
         */

        card.style.gridRow =
            element.period;


        card.innerHTML = `

            <span class="element-number">
                ${element.atomicNumber}
            </span>

            <span class="element-symbol">
                ${element.symbol}
            </span>

            <span class="element-name">
                ${element.name}
            </span>

        `;


        card.addEventListener(
            "click",
            () => {

                openElementDetails(
                    element
                );

            }
        );


        return card;

    }


    /*
     * =========================
     * جدول اصلی
     * =========================
     */

    mainElements.forEach(
        element => {

            table.appendChild(
                createElementCard(element)
            );

        }
    );


    /*
     * =========================
     * عنوان لانتانیدها
     * =========================
     */

    if (lanthanides.length > 0) {

    const label =
        document.createElement("div");

    label.className =
        "series-label lanthanide-label";

    label.style.gridColumn =
        "1 / 4";

    label.style.gridRow =
        "8";

    label.textContent =
        "لانتانیدها";

    table.appendChild(label);


    lanthanides.forEach(
        (element, index) => {

            const card =
                createElementCard(element);

            /*
             * لانتانیدها از ستون 4 شروع می‌شوند
             * و پشت سر هم قرار می‌گیرند.
             */

            card.style.gridColumn =
                `${index + 4}`;

            card.style.gridRow =
                "8";

            table.appendChild(card);

        }
    );
}

    /*
     * =========================
     * عنوان اکتینیدها
     * =========================
     */

    if (actinides.length > 0) {

    const label =
        document.createElement("div");

    label.className =
        "series-label actinide-label";

    label.style.gridColumn =
        "1 / 4";

    label.style.gridRow =
        "9";

    label.textContent =
        "اکتینیدها";

    table.appendChild(label);


    actinides.forEach(
        (element, index) => {

            const card =
                createElementCard(element);

            /*
             * اکتینیدها هم از ستون 4
             * به صورت پشت سر هم قرار می‌گیرند.
             */

            card.style.gridColumn =
                `${index + 4}`;

            card.style.gridRow =
                "9";

            table.appendChild(card);

        }
    );
}
}

    /* =========================
       SEARCH
    ========================== */

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderPeriodicTable(elements);

                return;

            }


            const filtered =
                elements.filter(element => {

                    return (

                        element.name
                            .toLowerCase()
                            .includes(query)

                        ||

                        element.englishName
                            .toLowerCase()
                            .includes(query)

                        ||

                        element.symbol
                            .toLowerCase()
                            .includes(query)

                        ||

                        String(
                            element.atomicNumber
                        ).includes(query)

                    );

                });


            renderPeriodicTable(filtered);

        }
    );


    /* =========================
       ELEMENT MODAL
    ========================== */

    const modal =
        document.getElementById(
            "element-modal"
        );


    const closeButton =
        document.getElementById(
            "close-element"
        );


    function openElementDetails(element) {

        document.getElementById(
            "detail-symbol"
        ).textContent =
            element.symbol;


        document.getElementById(
            "detail-number"
        ).textContent =
            `عدد اتمی: ${element.atomicNumber}`;


        document.getElementById(
            "detail-name"
        ).textContent =
            element.name;


        document.getElementById(
            "detail-english"
        ).textContent =
            element.englishName;


        document.getElementById(
            "detail-description"
        ).textContent =
            element.description;


        document.getElementById(
            "detail-mass"
        ).textContent =
            element.atomicMass;


        document.getElementById(
            "detail-category"
        ).textContent =
            element.category;


        document.getElementById(
            "detail-state"
        ).textContent =
            element.state;


        document.getElementById(
            "detail-electron"
        ).textContent =
            element.electronConfiguration;


            document.getElementById(
    "detail-electronegativity"
).textContent =
    element.electronegativity || "-";


document.getElementById(
    "detail-density"
).textContent =
    element.density || "-";


document.getElementById(
    "detail-melting"
).textContent =
    element.meltingPoint || "-";


document.getElementById(
    "detail-boiling"
).textContent =
    element.boilingPoint || "-";



    function createAtomModel(element) {

    const host =
        document.getElementById(
            "atom-css-viewer"
        );

    if (!host) return;

    host.innerHTML = "";

    const atom =
        document.createElement("div");

    atom.className = "css-atom";


    

    /* =========================
       هسته
    ========================== */

    const nucleus =
        document.createElement("div");

    nucleus.className =
        "atom-nucleus";

    nucleus.innerHTML = `
        <span>${element.symbol}</span>
        <small>${element.atomicNumber}</small>
    `;

    atom.appendChild(nucleus);


    /* =========================
       محاسبه الکترون‌های هر لایه
    ========================== */

    const config =
        String(
            element.electronConfiguration || ""
        );

    const matches =
        [
            ...config.matchAll(
                /(\d+)[spdf](?:\d+)?[¹²³⁴⁵⁶⁷⁸⁹⁰]*/g
            )
        ];

    const shells = [];


    if (matches.length) {

        matches.forEach(match => {

            const shell =
                Number(match[1]);

            const text =
                match[0];

            const superscript =
                text.match(
                    /[¹²³⁴⁵⁶⁷⁸⁹⁰]+$/
                )?.[0] || "";

            const map = {
                "⁰": 0,
                "¹": 1,
                "²": 2,
                "³": 3,
                "⁴": 4,
                "⁵": 5,
                "⁶": 6,
                "⁷": 7,
                "⁸": 8,
                "⁹": 9
            };

            const count =
                superscript
                    ? Number(
                        [...superscript]
                            .map(
                                x => map[x]
                            )
                            .join("")
                    )
                    : 0;

            shells[shell - 1] =
                (shells[shell - 1] || 0)
                + count;

        });

        

    }


    /* =========================
       اگر آرایش پیدا نشد
    ========================== */

    const fallback = [
        2,
        8,
        18,
        32,
        32,
        18,
        8
    ];

    const electronShells =
        shells.some(Boolean)
            ? shells
            : fallback;

            const shellCount = electronShells.length;

let atomScale = 1;

if (shellCount >= 6) {
    atomScale = 0.62;
} else if (shellCount >= 5) {
    atomScale = 0.72;
} else if (shellCount >= 4) {
    atomScale = 0.82;
} else if (shellCount >= 3) {
    atomScale = 0.92;
}

atom.style.transform = `scale(${atomScale})`;


    /* =========================
       ساخت مدارها
    ========================== */

    electronShells.forEach(
        (count, shellIndex) => {

            if (!count) return;

            const orbit =
                document.createElement("div");

            orbit.className =
                "atom-orbit";

            orbit.style.setProperty(
                "--orbit-size",
                `${95 + shellIndex * 55}px`
            );

            orbit.style.setProperty(
                "--speed",
                `${7 + shellIndex * 2}s`
            );


            /* الکترون‌ها */

            for (
                let i = 0;
                i < count;
                i++
            ) {

                const electron =
                    document.createElement("span");

                electron.className =
                    "atom-electron";

                electron.style.setProperty(
                    "--electron-angle",
                    `${(360 / count) * i}deg`
                );

                electron.style.setProperty(
                    "--orbit-size",
                    `${95 + shellIndex * 55}px`
                );

                orbit.appendChild(
                    electron
                );

            }

            atom.appendChild(
                orbit
            );

        }
    );


    host.appendChild(atom);
}


    /* =========================
   ELEMENT IMAGE
========================= */

const image =
    document.getElementById(
        "detail-image"
    );

const imageBox =
    document.querySelector(
        ".element-image-box"
    );

const placeholder =
    document.getElementById(
        "image-placeholder"
    );


imageBox.classList.remove(
    "has-image"
);


image.removeAttribute("src");

image.alt =
    element.name;


if (element.image) {

    image.src =
        element.image;


    image.onload = () => {

        imageBox.classList.add(
            "has-image"
        );

    };


    image.onerror = () => {

        imageBox.classList.remove(
            "has-image"
        );

    };

}


createAtomModel(element);


        /*
         * کاربردها
         */

        const uses =
            document.getElementById(
                "detail-uses"
            );


        uses.innerHTML = "";


        element.uses.forEach(use => {

            const li =
                document.createElement("li");

            li.textContent = use;

            uses.appendChild(li);

        });


        /*
         * خطرات
         */

        const dangers =
            document.getElementById(
                "detail-dangers"
            );


        dangers.innerHTML = "";


        element.dangers.forEach(danger => {

            const li =
                document.createElement("li");

            li.textContent = danger;

            dangers.appendChild(li);

        });


        /*
         * نمایش Modal
         */

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeElementDetails() {

        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    closeButton.addEventListener(
        "click",
        closeElementDetails
    );


    /*
     * کلیک روی پس‌زمینه
     */

    document
        .querySelector(
            ".element-modal-backdrop"
        )
        .addEventListener(
            "click",
            closeElementDetails
        );


    /*
     * ESC
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeElementDetails();

            }

        }
    );


    /*
     * شروع دریافت عناصر
     */

    loadElements();






    /* =========================
   COMPOUNDS
========================= */

const compoundSection = document.getElementById("compounds-section");

const elementOneSelect = document.getElementById("compound-element-1");
const elementTwoSelect = document.getElementById("compound-element-2");
const compoundResult = document.getElementById("compound-result");
const findCompoundButton = document.getElementById("find-compound");


let compounds = [];


/* دریافت دیتابیس ترکیبات */

async function loadCompounds() {

    try {

        const response = await fetch("/compounds.json");

        if (!response.ok) {
            throw new Error("خطا در دریافت ترکیبات");
        }

        compounds = await response.json();

        fillCompoundSelects();

    } catch (error) {

        console.error("Compound error:", error);

        if (compoundResult) {
            compoundResult.innerHTML = `
                <div class="compound-error">
                    خطا در بارگذاری اطلاعات ترکیبات
                </div>
            `;
        }

    }

}


/* ساخت گزینه‌های عناصر */

function fillCompoundSelects() {

    if (!elementOneSelect || !elementTwoSelect) return;

    elementOneSelect.innerHTML =
        `<option value="">عنصر اول را انتخاب کنید</option>`;

    elementTwoSelect.innerHTML =
        `<option value="">عنصر دوم را انتخاب کنید</option>`;


    elements.forEach(element => {

        const option1 = document.createElement("option");

        option1.value = element.symbol;

        option1.textContent =
            `${element.symbol} — ${element.name}`;


        const option2 = option1.cloneNode(true);


        elementOneSelect.appendChild(option1);

        elementTwoSelect.appendChild(option2);

    });

}


/* پیدا کردن ترکیب */

function findCompounds() {

    if (!elementOneSelect || !elementTwoSelect) return;


    const first =
        elementOneSelect.value;

    const second =
        elementTwoSelect.value;


    if (!first || !second) {

        compoundResult.innerHTML = `
            <div class="compound-message">
                لطفاً هر دو عنصر را انتخاب کنید.
            </div>
        `;

        return;

    }


    if (first === second) {

        compoundResult.innerHTML = `
            <div class="compound-message">
                لطفاً دو عنصر متفاوت انتخاب کنید.
            </div>
        `;

        return;

    }


    const found =
        compounds.filter(compound => {

            const symbols =
                compound.elements.map(
                    item => item.symbol
                );

            return (
                symbols.includes(first) &&
                symbols.includes(second) &&
                symbols.length === 2
            );

        });


    if (!found.length) {

        compoundResult.innerHTML = `
            <div class="compound-not-found">

                <div class="compound-icon">
                    🧪
                </div>

                <h3>
                    ترکیبی پیدا نشد
                </h3>

                <p>
                    برای ${first} و ${second}
                    ترکیب ثبت‌شده‌ای در دیتابیس آموزشی سایت وجود ندارد.
                </p>

            </div>
        `;

        return;

    }


    compoundResult.innerHTML = `

        <div class="compound-results-title">
            ترکیب‌های شناخته‌شده
        </div>

        <div class="compound-results-list">

            ${found.map(compound => {

                const firstElement =
                    compound.elements.find(
                        item => item.symbol === first
                    );

                const secondElement =
                    compound.elements.find(
                        item => item.symbol === second
                    );


                const ratio =
                    `${firstElement.count} : ${secondElement.count}`;


                return `

                    <div class="compound-card">

                        <div class="compound-formula">
                            ${formatFormula(compound.formula)}
                        </div>

                        <div class="compound-info">

                            <h3>
                                ${compound.name}
                            </h3>

                            <span class="compound-english">
                                ${compound.englishName || ""}
                            </span>

                        </div>


                        <div class="compound-details">

                            <div>
                                <span>نوع ترکیب</span>
                                <strong>
                                    ${compound.type || "-"}
                                </strong>
                            </div>

                            <div>
                                <span>نسبت عناصر</span>
                                <strong>
                                    ${ratio}
                                </strong>
                            </div>

                        </div>


                        <p class="compound-description">
                            ${compound.description || ""}
                        </p>

                    </div>

                `;

            }).join("")}

        </div>
    `;

}


/* تبدیل عددهای معمولی به زیروند */

function formatFormula(formula) {

    const subscripts = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉"
    };


    return formula.replace(
        /\d/g,
        digit => subscripts[digit]
    );

}


/* دکمه جستجوی ترکیب */

if (findCompoundButton) {

    findCompoundButton.addEventListener(
        "click",
        findCompounds
    );

}


/* با تغییر هر عنصر هم جستجو انجام شود */

if (elementOneSelect) {

    elementOneSelect.addEventListener(
        "change",
        () => {

            if (
                elementTwoSelect &&
                elementTwoSelect.value
            ) {
                findCompounds();
            }

        }
    );

}


if (elementTwoSelect) {

    elementTwoSelect.addEventListener(
        "change",
        () => {

            if (
                elementOneSelect &&
                elementOneSelect.value
            ) {
                findCompounds();
            }

        }
    );

}


/* شروع دریافت ترکیبات */

loadCompounds();

});