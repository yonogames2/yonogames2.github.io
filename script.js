console.log("script.js started");

const gameList = document.getElementById("game-list");

function showMessage(message) {
    if (gameList) {
        gameList.innerHTML = `
            <div class="message">
                ${message}
            </div>
        `;
    }
}


/* =================================
   CHECK SUPABASE LIBRARY
================================= */

if (!window.supabase) {

    console.error("Supabase library load nahi hui.");

    showMessage(
        "Supabase load nahi hui. Internet check karo aur page refresh karo."
    );

} else {

    console.log("Supabase library OK");


    /* =================================
       SUPABASE SETTINGS
    ================================= */

    const SUPABASE_URL =
        "https://srbvlfjthbkdixlwlcvz.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    let allGames = [];

    let currentTab = "yono";

    let searchText = "";


    /* =================================
       LOAD GAMES FROM SUPABASE
    ================================= */

    async function loadGames() {

        showMessage("Loading games...");

        console.log("Loading games from Supabase...");


        try {

            const result =
                await supabaseClient
                    .from("games")
                    .select("*")
                    .eq("is_visible", true)
                    .order("id", {
                        ascending: true
                    });


            const data = result.data;

            const error = result.error;


            console.log("Supabase data:", data);

            console.log("Supabase error:", error);


            /* =============================
               SUPABASE ERROR
            ============================= */

            if (error) {

                console.error(
                    "Supabase Error:",
                    error
                );

                showMessage(
                    "Supabase Error: " +
                    error.message
                );

                return;
            }


            /* =============================
               NO DATA
            ============================= */

            if (!data) {

                showMessage(
                    "Games ka data nahi mila."
                );

                return;
            }


            /* =============================
               SAVE DATA
            ============================= */

            allGames = data;


            console.log(
                "Total games:",
                allGames.length
            );


            /* =============================
               RENDER
            ============================= */

            renderGames();


        } catch (error) {

            console.error(
                "Connection Error:",
                error
            );


            showMessage(
                "Connection Error: " +
                (error.message || "Unknown error")
            );
        }
    }


    /* =================================
       RENDER GAMES
    ================================= */

    function renderGames() {

        if (!gameList) {

            console.error(
                "game-list element nahi mila."
            );

            return;
        }


        const filteredGames =
            allGames.filter(function(game) {


                /* =========================
                   CATEGORY
                ========================= */

                const category =
                    String(
                        game.category || ""
                    )
                    .trim()
                    .toLowerCase();


                let categoryMatch;


                if (currentTab === "yono") {

                    categoryMatch =
                        category === "yono";

                } else {

                    categoryMatch =
                        category !== "yono";
                }


                /* =========================
                   SEARCH
                ========================= */

                const name =
                    String(
                        game.name || ""
                    )
                    .toLowerCase();


                const searchMatch =
                    name.includes(
                        searchText.toLowerCase()
                    );


                return (
                    categoryMatch &&
                    searchMatch
                );

            });


        /* =============================
           NO GAME
        ============================= */

        if (filteredGames.length === 0) {

            gameList.innerHTML = `
                <div class="message">
                    Is category me koi game nahi mila.
                </div>
            `;

            return;
        }


        /* =============================
           CLEAR OLD GAMES
        ============================= */

        gameList.innerHTML = "";


        /* =============================
           CREATE GAME CARDS
        ============================= */

        filteredGames.forEach(function(game) {


            const card =
                document.createElement("div");


            card.className = "game-card";


            /* =========================
               GAME LOGO
            ========================= */

            let logoHTML = "🎮";


            if (game.logo_url) {

                logoHTML = `
                    <img
                        src="${escapeHTML(
                            game.logo_url
                        )}"
                        alt="${escapeHTML(
                            game.name || "Game"
                        )}"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML='🎮';
                        "
                    >
                `;
            }


            /* =========================
               GAME LINK
            ========================= */

            let link =
                String(
                    game.playstore_link || ""
                ).trim();


            if (
                link &&
                !link.startsWith("http://") &&
                !link.startsWith("https://")
            ) {

                link =
                    "https://" + link;
            }


            /* =========================
               DOWNLOAD BUTTON
            ========================= */

            let downloadButton;


            if (link) {

                downloadButton = `
                    <a
                        class="download"
                        href="${escapeHTML(link)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>⇩</span>
                        <span>Download</span>
                    </a>
                `;

            } else {

                downloadButton = `
                    <button
                        class="download"
                        type="button"
                        disabled
                        style="
                            opacity:0.5;
                            cursor:not-allowed;
                        "
                    >
                        <span>⇩</span>
                        <span>Link Not Available</span>
                    </button>
                `;
            }


            /* =========================
               GAME CARD HTML
            ========================= */

            card.innerHTML = `

                <div class="logo">
                    ${logoHTML}
                </div>


                <div class="details">

                    <div class="game-name">
                        ${escapeHTML(
                            game.name || "Game"
                        )}
                    </div>


                    <div class="signup-bonus">
                        Sign Up Bonus:
                        ${escapeHTML(
                            game.signup_bonus || "N/A"
                        )}
                    </div>


                    <div class="minimum-withdrawal">
                        Minimum Withdrawal:
                        ${escapeHTML(
                            game.minimum_withdrawal || "N/A"
                        )}
                    </div>

                </div>


                <div class="right-side">

                    ${downloadButton}


                    <div class="basic-info">

                        <span class="rating">

                            <span class="star">
                                ★
                            </span>

                            ${escapeHTML(
                                game.rating ?? "N/A"
                            )}

                        </span>


                        <span class="separator">
                            |
                        </span>


                        <span class="size">

                            ${escapeHTML(
                                game.size_mb ?? "N/A"
                            )}

                        </span>

                    </div>

                </div>

            `;


            gameList.appendChild(card);

        });
    }


    /* =================================
       ESCAPE HTML
    ================================= */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";
        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* =================================
       SEARCH
    ================================= */

    const search =
        document.getElementById("search");


    if (search) {

        search.addEventListener(
            "input",
            function(event) {

                searchText =
                    event.target.value.trim();


                renderGames();

            }
        );
    }


    /* =================================
       YONO TAB
    ================================= */

    const yonoTab =
        document.getElementById("yonoTab");


    const otherTab =
        document.getElementById("otherTab");


    if (yonoTab) {

        yonoTab.addEventListener(
            "click",
            function() {

                currentTab = "yono";


                yonoTab.classList.add(
                    "active"
                );


                if (otherTab) {

                    otherTab.classList.remove(
                        "active"
                    );
                }


                renderGames();

            }
        );
    }


    /* =================================
       OTHERS TAB
    ================================= */

    if (otherTab) {

        otherTab.addEventListener(
            "click",
            function() {

                currentTab = "others";


                otherTab.classList.add(
                    "active"
                );


                if (yonoTab) {

                    yonoTab.classList.remove(
                        "active"
                    );
                }


                renderGames();

            }
        );
    }


    /* =================================
       START
    ================================= */

    loadGames();

    }
