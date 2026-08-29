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

if (!window.supabase) {

    console.error("Supabase library load nahi hui.");

    showMessage(
        "Supabase library load nahi hui. Internet check karo."
    );

} else {

    console.log("Supabase library OK");

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


    /* =========================
       LOAD GAMES
    ========================= */

    async function loadGames() {

        showMessage("Loading games...");

        try {

            const { data, error } =
                await supabaseClient
                    .from("games")
                    .select("*")
                    .eq("is_visible", true)
                    .order("id", {
                        ascending: true
                    });

            console.log("Supabase data:", data);
            console.log("Supabase error:", error);

            if (error) {

                showMessage(
                    "Supabase Error: " +
                    error.message
                );

                return;
            }

            allGames = data || [];

            renderGames();

        } catch (error) {

            console.error("Load error:", error);

            showMessage(
                "Connection Error: " +
                (error.message || error)
            );
        }
    }


    /* =========================
       RENDER GAMES
    ========================= */

    function renderGames() {

        if (!gameList) return;

        const filteredGames =
            allGames.filter(function(game) {

                const category =
                    String(game.category || "")
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

                const name =
                    String(game.name || "")
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


        if (filteredGames.length === 0) {

            gameList.innerHTML = `
                <div class="message">
                    Is category me koi game nahi mila.
                </div>
            `;

            return;
        }


        gameList.innerHTML = "";


        filteredGames.forEach(function(game) {

            const card =
                document.createElement("div");

            card.className = "game-card";


            /* =========================
               LOGO
            ========================= */

            const logo = game.logo_url
                ? `
                    <img
                        src="${escapeHTML(game.logo_url)}"
                        alt="${escapeHTML(
                            game.name || "Game"
                        )}"
                    >
                  `
                : "🎮";


            /* =========================
               GAME LINK
            ========================= */

            let link =
                String(game.playstore_link || "")
                    .trim();


            /*
             * Agar link me https:// nahi hai,
             * automatically add hoga.
             */

            if (
                link &&
                !link.startsWith("http://") &&
                !link.startsWith("https://")
            ) {

                link = "https://" + link;
            }


            /* =========================
               DOWNLOAD BUTTON
            ========================= */

            let downloadButton = "";

            if (link) {

                downloadButton = `
                    <a
                        class="download"
                        href="${escapeHTML(link)}"
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
               GAME CARD
            ========================= */

            card.innerHTML = `

                <div class="logo">
                    ${logo}
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


    /* =========================
       ESCAPE HTML
    ========================= */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================
       SEARCH
    ========================= */

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


    /* =========================
       YONO TAB
    ========================= */

    const yonoTab =
        document.getElementById("yonoTab");

    const otherTab =
        document.getElementById("otherTab");


    if (yonoTab) {

        yonoTab.addEventListener(
            "click",
            function() {

                currentTab = "yono";

                yonoTab.classList.add("active");

                if (otherTab) {

                    otherTab.classList.remove(
                        "active"
                    );

                }

                renderGames();

            }
        );
    }


    /* =========================
       OTHERS TAB
    ========================= */

    if (otherTab) {

        otherTab.addEventListener(
            "click",
            function() {

                currentTab = "others";

                otherTab.classList.add("active");

                if (yonoTab) {

                    yonoTab.classList.remove(
                        "active"
                    );

                }

                renderGames();

            }
        );
    }


    /* =========================
       START WEBSITE
    ========================= */

    loadGames();

              }
