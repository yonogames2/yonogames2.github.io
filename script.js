console.log("script.js started");


/* ================================
   DOM ELEMENTS
================================ */

const gameList = document.getElementById("game-list");

const yonoBtn = document.getElementById("yono-btn");
const othersBtn = document.getElementById("others-btn");

const searchInput = document.getElementById("search-input");

const othersExtra = document.getElementById("others-extra");

const newLaunchSection =
    document.getElementById("new-launch-section");

const newLaunchCard =
    document.getElementById("new-launch-card");

const menuBtn =
    document.getElementById("menu-btn");

const menu =
    document.getElementById("menu");

const bannerTrack =
    document.getElementById("banner-track");


/* ================================
   VARIABLES
================================ */

let allGames = [];

let currentCategory = "yono";

let currentBanner = 0;


/* ================================
   SUPABASE
================================ */

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";

/*
   Yaha apna actual Supabase
   Publishable / Anon key rakho.

   Example:

   const SUPABASE_KEY = "eyJ....";

   Apna real key kisi ko chat me mat bhejna.
*/

const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


if (!window.supabase) {

    console.error(
        "Supabase library load nahi hui."
    );

    showMessage(
        "Supabase library load nahi hui."
    );

} else {

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* ================================
       SHOW MESSAGE
    ================================= */

    function showMessage(message) {

        if (gameList) {

            gameList.innerHTML = `
                <div class="message">
                    ${message}
                </div>
            `;

        }

    }


    /* ================================
       ESCAPE HTML
    ================================= */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ================================
       CREATE GAME CARD
    ================================= */

    function createGameCard(game) {

        const name =
            escapeHTML(game.name || "Game");

        const logo =
            escapeHTML(game.logo_url || "");

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
                game.rating ?? "-"
            );

        const size =
            escapeHTML(
                game.size_mb || "-"
            );


        /*
           IMPORTANT:

           playstore_link ka exact URL use hoga.
           Isme Play Store home page force nahi
           kiya ja raha hai.
        */

        let gameLink =
            String(
                game.playstore_link || ""
            ).trim();


        /*
           Agar URL empty hai toh button disabled
           jaisa rahega.
        */

        let downloadButton = "";

        if (gameLink) {

            downloadButton = `
                <a
                    class="download-btn"
                    href="${escapeHTML(gameLink)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    DOWNLOAD
                </a>
            `;

        } else {

            downloadButton = `
                <span
                    class="download-btn"
                    style="opacity:0.5;"
                >
                    NO LINK
                </span>
            `;

        }


        return `

            <div class="game-card">

                <img
                    class="game-logo"
                    src="${logo}"
                    alt="${name}"
                    onerror="
                        this.style.display='none';
                    "
                >

                <div class="game-info">

                    <div class="game-name">
                        ${name}
                    </div>

                    <div class="signup-bonus">
                        Signup Bonus:
                        ${signupBonus}
                    </div>

                    <div class="minimum-withdrawal">
                        Minimum Withdrawal:
                        ${minimumWithdrawal}
                    </div>

                </div>


                <div class="game-action">

                    ${downloadButton}

                    <div class="game-rating">
                        ⭐ ${rating}
                    </div>

                    <div class="game-size">
                        ${size}
                    </div>

                </div>

            </div>

        `;

    }


    /* ================================
       NEW LAUNCH
    ================================= */

    function showNewLaunch(category) {

        if (!newLaunchCard) {
            return;
        }


        const categoryGames =
            allGames.filter(game => {

                return String(
                    game.category || ""
                ).toLowerCase().trim()
                === category;

            });


        if (categoryGames.length === 0) {

            newLaunchCard.innerHTML = "";

            return;

        }


        /*
           Agar database me is_new_launch
           column nahi hai, toh latest game
           ko NEW LAUNCH me dikhayenge.
        */

        let newGame =
            categoryGames.find(
                game =>
                    game.is_new_launch === true
            );


        if (!newGame) {

            newGame =
                categoryGames[
                    categoryGames.length - 1
                ];

        }


        newLaunchCard.innerHTML =
            createGameCard(newGame);

    }


    /* ================================
       LOAD GAMES
    ================================= */

    async function loadGames() {

        console.log("Loading games...");

        showMessage(
            "Loading games..."
        );


        try {

            const {
                data,
                error
            } = await supabaseClient
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


            console.log(
                "Supabase data:",
                data
            );

            console.log(
                "Supabase error:",
                error
            );


            if (error) {

                console.error(
                    "Supabase Error:",
                    error
                );

                showMessage(
                    "Supabase Error: " +
                    escapeHTML(
                        error.message ||
                        "Unknown error"
                    )
                );

                return;

            }


            allGames =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "Total games:",
                allGames.length
            );


            if (allGames.length === 0) {

                showMessage(
                    "Abhi koi visible game nahi hai."
                );

                showNewLaunch(
                    currentCategory
                );

                return;

            }


            showGames(
                currentCategory
            );

        }

        catch (error) {

            console.error(
                "Connection Error:",
                error
            );

            showMessage(
                "Connection Error: " +
                escapeHTML(
                    error.message ||
                    "Supabase se connect nahi ho paya."
                )
            );

        }

    }


    /* ================================
       SHOW GAMES
    ================================= */

    function showGames(category) {

        currentCategory =
            category;


        /* BUTTON ACTIVE */

        if (yonoBtn) {

            yonoBtn.classList.toggle(
                "active",
                category === "yono"
            );

        }


        if (othersBtn) {

            othersBtn.classList.toggle(
                "active",
                category === "others"
            );

        }


        /*
           OTHERS ke extra features
           SIRF OTHERS me show honge.
        */

        if (othersExtra) {

            othersExtra.style.display =
                category === "others"
                    ? "block"
                    : "none";

        }


        /*
           NEW LAUNCH ko hide nahi karna.
        */

        if (newLaunchSection) {

            newLaunchSection.style.display =
                "block";

        }


        /* NEW LAUNCH */

        showNewLaunch(
            category
        );


        /* FILTER CATEGORY */

        const categoryGames =
            allGames.filter(game => {

                return String(
                    game.category || ""
                ).toLowerCase().trim()
                === category;

            });


        /*
           SEARCH
        */

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const filteredGames =
            categoryGames.filter(game => {

                const name =
                    String(
                        game.name || ""
                    ).toLowerCase();

                return name.includes(
                    searchText
                );

            });


        if (
            filteredGames.length === 0
        ) {

            showMessage(
                searchText
                    ? "Game nahi mila."
                    : "Is category me abhi koi game nahi hai."
            );

            return;

        }


        gameList.innerHTML =
            filteredGames
                .map(
                    game =>
                        createGameCard(game)
                )
                .join("");

    }


    /* ================================
       CATEGORY BUTTONS
    ================================= */

    if (yonoBtn) {

        yonoBtn.addEventListener(
            "click",
            function () {

                showGames("yono");

            }
        );

    }


    if (othersBtn) {

        othersBtn.addEventListener(
            "click",
            function () {

                showGames("others");

            }
        );

    }


    /* ================================
       SEARCH
    ================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                showGames(
                    currentCategory
                );

            }
        );

    }


    /* ================================
       MENU
    ================================= */

    if (menuBtn && menu) {

        menuBtn.addEventListener(
            "click",
            function () {

                if (
                    menu.style.display ===
                    "block"
                ) {

                    menu.style.display =
                        "none";

                } else {

                    menu.style.display =
                        "block";

                }

            }
        );

    }


    /* ================================
       AUTO BANNER SLIDER
       EVERY 4 SECONDS
    ================================= */

    function moveBanner() {

        if (
            !bannerTrack
        ) {
            return;
        }


        /*
           Slider sirf OTHERS me chalega.
        */

        if (
            currentCategory !==
            "others"
        ) {

            return;

        }


        const slides =
            bannerTrack.querySelectorAll(
                ".banner-slide"
            );


        if (
            slides.length <= 1
        ) {

            return;

        }


        currentBanner++;


        if (
            currentBanner >=
            slides.length
        ) {

            currentBanner = 0;

        }


        bannerTrack.style.transform =
            `translateX(-${
                currentBanner * 100
            }%)`;

    }


    setInterval(
        moveBanner,
        4000
    );


    /* ================================
       START
    ================================= */

    loadGames();

}
