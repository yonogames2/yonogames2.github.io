console.log("script.js started");


/* =========================
   ELEMENTS
========================= */

const gameList =
    document.getElementById("game-list");

const newLaunchSection =
    document.getElementById("new-launch-section");

const newLaunchCard =
    document.getElementById("new-launch-card");

const searchInput =
    document.getElementById("search");

const yonoButton =
    document.getElementById("yono-btn");

const othersButton =
    document.getElementById("others-btn");


/* =========================
   VARIABLES
========================= */

let allGames = [];

let currentCategory = "yono";


/* =========================
   MESSAGE
========================= */

function showMessage(message) {

    if (!gameList) {
        return;
    }

    gameList.innerHTML = `
        <div class="message">
            ${message}
        </div>
    `;
}


/* =========================
   SUPABASE
========================= */

if (!window.supabase) {

    console.error(
        "Supabase library load nahi hui."
    );

    showMessage(
        "Supabase library load nahi hui."
    );

} else {


    /* =========================
       SUPABASE URL
    ========================= */

    const SUPABASE_URL =
        "https://srbvlfjthbkdixlwlcvz.supabase.co";


    /* =========================
       SUPABASE KEY
    ========================= */

    /*
       Yaha apni Supabase
       Publishable / Anon key paste karo.
    */

    const SUPABASE_KEY =
        "PASTE_YOUR_SUPABASE_KEY_HERE";


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =========================
       ESCAPE HTML
    ========================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================
       GAME CARD
    ========================= */

    function createGameCard(game) {

        const gameName =
            escapeHTML(
                game.name || "Game"
            );


        const logo =
            String(
                game.logo_url || ""
            ).trim();


        const signupBonus =
            escapeHTML(
                game.signup_bonus || ""
            );


        const minimumWithdrawal =
            escapeHTML(
                game.minimum_withdrawal || ""
            );


        const rating =
            escapeHTML(
                game.rating ?? ""
            );


        const size =
            escapeHTML(
                game.size_mb || ""
            );


        /*
           playstore_link column
           se exact link.
        */

        const gameLink =
            String(
                game.playstore_link || ""
            ).trim();


        const validLink =
            /^https?:\/\//i.test(
                gameLink
            );


        let logoHTML = "🎮";


        if (
            /^https?:\/\//i.test(logo)
        ) {

            logoHTML = `
                <img
                    src="${escapeHTML(logo)}"
                    alt="${gameName}"
                    loading="lazy"
                >
            `;
        }


        let buttonHTML;


        if (validLink) {

            buttonHTML = `
                <a
                    class="download-btn"
                    href="${escapeHTML(gameLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Download
                </a>
            `;

        } else {

            buttonHTML = `
                <a
                    class="download-btn"
                    href="#"
                    onclick="return false;"
                    style="
                        opacity:.5;
                        cursor:not-allowed;
                    "
                >
                    No Link
                </a>
            `;

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "game-card";


        card.innerHTML = `

            <div class="game-logo">

                ${logoHTML}

            </div>


            <div class="game-info">

                <div class="game-name">
                    ${gameName}
                </div>


                <div class="signup">
                    Sign Up Bonus:
                    ${signupBonus}
                </div>


                <div class="withdraw">
                    Minimum Withdrawal:
                    ${minimumWithdrawal}
                </div>

            </div>


            <div class="game-action">

                ${buttonHTML}


                <div class="game-meta">

                    <span>

                        <span class="star">
                            ★
                        </span>

                        ${rating}

                    </span>


                    <span class="separator">
                        |
                    </span>


                    <span>
                        ${size}
                    </span>

                </div>

            </div>

        `;


        return card;
    }


    /* =========================
       NEW LAUNCH
    ========================= */

    function showNewLaunch() {

        if (
            !newLaunchSection ||
            !newLaunchCard
        ) {
            return;
        }


        /*
           Agar is_new_launch column
           available hai aur true hai,
           to woh game New Launch mein
           show hogi.

           Agar column available nahi hai,
           to latest game show hogi.
        */

        let newLaunchGame =
            allGames.find(
                game =>
                    game.is_new_launch === true
            );


        /*
           Agar is_new_launch true nahi mila,
           to first/latest visible game ko
           New Launch mein show karo.
        */

        if (!newLaunchGame) {

            if (allGames.length > 0) {

                newLaunchGame =
                    allGames[
                        allGames.length - 1
                    ];

            }

        }


        newLaunchCard.innerHTML = "";


        if (!newLaunchGame) {

            newLaunchCard.innerHTML = `
                <div class="message">
                    No new game available.
                </div>
            `;

            return;
        }


        const card =
            createGameCard(
                newLaunchGame
            );


        newLaunchCard.appendChild(
            card
        );

    }


    /* =========================
       LOAD GAMES
    ========================= */

    async function loadGames() {

        showMessage(
            "Loading games..."
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient

                    .from("Games")

                    .select("*")

                    .eq(
                        "is_visible",
                        true
                    )

                    .order(
                        "id",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "Supabase Error:",
                    error
                );


                showMessage(
                    "Games load nahi ho rahe."
                );


                return;
            }


            allGames =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "Games:",
                allGames
            );


            /*
               New Launch
            */

            showNewLaunch();


            /*
               Category games
            */

            showGames(
                currentCategory
            );

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                "Games load nahi ho rahe."
            );

        }

    }


    /* =========================
       SHOW GAMES
    ========================= */

    function showGames(category) {

        currentCategory =
            category;


        /* BUTTON */

        if (
            yonoButton &&
            othersButton
        ) {

            yonoButton.classList
                .remove("active");

            othersButton.classList
                .remove("active");


            if (
                category === "yono"
            ) {

                yonoButton.classList
                    .add("active");

            }


            if (
                category === "others"
            ) {

                othersButton.classList
                    .add("active");

            }

        }


        /* FILTER */

        const games =
            allGames.filter(
                game => {

                    const gameCategory =
                        String(
                            game.category || ""
                        )
                        .trim()
                        .toLowerCase();


                    return (
                        gameCategory ===
                        category
                    );

                }
            );


        /* EMPTY */

        if (
            games.length === 0
        ) {

            showMessage(
                "Is category me abhi koi game nahi hai."
            );

            return;
        }


        /* CLEAR */

        gameList.innerHTML = "";


        /* SHOW */

        games.forEach(
            game => {

                gameList.appendChild(
                    createGameCard(game)
                );

            }
        );

    }


    /* =========================
       YONO
    ========================= */

    if (yonoButton) {

        yonoButton.addEventListener(
            "click",
            function () {

                showGames("yono");

            }
        );

    }


    /* =========================
       OTHERS
    ========================= */

    if (othersButton) {

        othersButton.addEventListener(
            "click",
            function () {

                showGames("others");

            }
        );

    }


    /* =========================
       SEARCH
    ========================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchText =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!searchText) {

                    showGames(
                        currentCategory
                    );

                    return;

                }


                const games =
                    allGames.filter(
                        game => {

                            const category =
                                String(
                                    game.category || ""
                                )
                                .trim()
                                .toLowerCase();


                            const name =
                                String(
                                    game.name || ""
                                )
                                .toLowerCase();


                            return (
                                category ===
                                currentCategory
                                &&
                                name.includes(
                                    searchText
                                )
                            );

                        }
                    );


                if (
                    games.length === 0
                ) {

                    showMessage(
                        "Game nahi mila."
                    );

                    return;
                }


                gameList.innerHTML = "";


                games.forEach(
                    game => {

                        gameList.appendChild(
                            createGameCard(game)
                        );

                    }
                );

            }
        );

    }


    /* =========================
       START
    ========================= */

    loadGames();

}


/* =========================
   MENU
========================= */

const menuBtn =
    document.getElementById(
        "menu-btn"
    );

const menuBox =
    document.getElementById(
        "menu-box"
    );


if (
    menuBtn &&
    menuBox
) {

    menuBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            menuBox.classList.toggle(
                "show"
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !menuBox.contains(
                    event.target
                ) &&
                event.target !== menuBtn
            ) {

                menuBox.classList.remove(
                    "show"
                );

            }

        }
    );

}


/* =========================
   AUTO BANNER SLIDER
========================= */

const bannerSlider =
    document.getElementById(
        "banner-slider"
    );


let bannerIndex = 0;


if (bannerSlider) {

    const slides =
        bannerSlider.querySelectorAll(
            ".banner-slide"
        );


    if (slides.length > 1) {

        setInterval(
            function () {

                bannerIndex++;


                /*
                   Last ke baad first par
                   wapas.
                */

                if (
                    bannerIndex >=
                    slides.length
                ) {

                    bannerIndex = 0;

                }


                /*
                   LEFT direction slide
                */

                bannerSlider.style.transform =
                    `translateX(-${
                        bannerIndex * 100
                    }%)`;


            },
            4000
        );

    }

}
