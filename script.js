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

const othersExtra =
    document.getElementById("others-extra");


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

    const SUPABASE_URL =
        "https://srbvlfjthbkdixlwlcvz.supabase.co";


    /*
       Apni Supabase Publishable / Anon key
       yaha paste karo.
    */

    const SUPABASE_KEY =
        "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


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
           playstore_link me jo exact URL hai,
           wahi open hoga.
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
            document.createElement("div");


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

    function showNewLaunch(category) {

        if (
            !newLaunchSection ||
            !newLaunchCard
        ) {
            return;
        }


        /*
           New Launch ko selected category
           ke hisaab se rakhenge.
        */

        const categoryGames =
            allGames.filter(game => {

                const gameCategory =
                    String(
                        game.category || ""
                    )
                    .trim()
                    .toLowerCase();

                return (
                    gameCategory === category
                );
            });


        let newLaunchGame =
            categoryGames.find(
                game =>
                    game.is_new_launch === true
            );


        /*
           Agar is_new_launch column nahi hai
           ya true game nahi mila,
           to latest game show hoga.
        */

        if (!newLaunchGame) {

            if (
                categoryGames.length > 0
            ) {

                newLaunchGame =
                    categoryGames[
                        categoryGames.length - 1
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


        newLaunchCard.appendChild(
            createGameCard(
                newLaunchGame
            )
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


        /* =========================
           BUTTON ACTIVE
        ========================= */

        if (
            yonoButton &&
            othersButton
        ) {

            yonoButton.classList.remove(
                "active"
            );

            othersButton.classList.remove(
                "active"
            );


            if (
                category === "yono"
            ) {

                yonoButton.classList.add(
                    "active"
                );

            } else {

                othersButton.classList.add(
                    "active"
                );
            }
        }


        /* =========================
           OTHERS EXTRA SHOW/HIDE
        ========================= */

        if (othersExtra) {

            if (
                category === "others"
            ) {

                othersExtra.style.display =
                    "block";

            } else {

                othersExtra.style.display =
                    "none";
            }
        }


        /* =========================
           NEW LAUNCH
        ========================= */

        showNewLaunch(
            category
        );


        /* =========================
           FILTER
        ========================= */

        const games =
            allGames.filter(game => {

                const gameCategory =
                    String(
                        game.category || ""
                    )
                    .trim()
                    .toLowerCase();

                return (
                    gameCategory === category
                );
            });


        /* =========================
           EMPTY
        ========================= */

        if (
            games.length === 0
        ) {

            showMessage(
                "Is category me abhi koi game nahi hai."
            );

            return;
        }


        /* =========================
           CLEAR
        ========================= */

        gameList.innerHTML = "";


        /* =========================
           SHOW
        ========================= */

        games.forEach(game => {

            gameList.appendChild(
                createGameCard(game)
            );

        });
    }


    /* =========================
       YONO BUTTON
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
       OTHERS BUTTON
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


                const games =
                    allGames.filter(game => {

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
                    });


                if (
                    games.length === 0
                ) {

                    showMessage(
                        "Game nahi mila."
                    );

                    return;
                }


                gameList.innerHTML = "";


                games.forEach(game => {

                    gameList.appendChild(
                        createGameCard(game)
                    );

                });

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

                /*
                   Agar OTHERS visible nahi hai,
                   slider move nahi karega.
                */

                if (
                    currentCategory !==
                    "others"
                ) {
                    return;
                }


                bannerIndex++;


                if (
                    bannerIndex >=
                    slides.length
                ) {

                    bannerIndex = 0;
                }


                bannerSlider.style.transform =
                    `translateX(-${
                        bannerIndex * 100
                    }%)`;

            },
            4000
        );
    }
           }
