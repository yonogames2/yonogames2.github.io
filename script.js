console.log("SCRIPT.JS VERSION 7 LOADED");


/* =================================
   TEST POPUP
================================= */

alert("NEW SCRIPT LOADED");


/* =================================
   GAME LIST
================================= */

const gameList =
    document.getElementById("game-list");


/* =================================
   SUPABASE
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


/* =================================
   VARIABLES
================================= */

let allGames = [];

let currentTab = "yono";

let searchText = "";


/* =================================
   MESSAGE
================================= */

function showMessage(message) {

    if (!gameList) return;

    gameList.innerHTML = `
        <div class="message">
            ${message}
        </div>
    `;
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

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


/* =================================
   LOAD GAMES
================================= */

async function loadGames() {

    showMessage(
        "Loading games..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("games")

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
            "SUPABASE DATA:",
            data
        );


        console.log(
            "SUPABASE ERROR:",
            error
        );


        if (error) {

            showMessage(
                "Supabase Error: " +
                error.message
            );

            return;
        }


        allGames =
            data || [];


        renderGames();


    } catch (error) {

        console.error(error);

        showMessage(
            "Connection Error: " +
            error.message
        );
    }
}


/* =================================
   RENDER
================================= */

function renderGames() {

    if (!gameList) return;


    const filteredGames =
        allGames.filter(
            function(game) {


                const category =
                    String(
                        game.category || ""
                    )
                    .trim()
                    .toLowerCase();


                let categoryMatch;


                if (
                    currentTab === "yono"
                ) {

                    categoryMatch =
                        category === "yono";

                } else {

                    categoryMatch =
                        category !== "yono";
                }


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

            }
        );


    if (
        filteredGames.length === 0
    ) {

        showMessage(
            "Is category me koi game nahi mila."
        );

        return;
    }


    gameList.innerHTML = "";


    filteredGames.forEach(
        function(game) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "game-card";


            /* =========================
               LOGO
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
                    >
                `;
            }


            /* =========================
               TEST LINK
               
               IMPORTANT:
               TEMPORARILY USING
               EXAMPLE.COM
            ========================= */

            let gameLink =
                "https://example.com";


            console.log(
                "TEST GAME LINK:",
                gameLink
            );


            /* =========================
               DOWNLOAD BUTTON
            ========================= */

            const downloadButton = `

                <a
                    class="download"
                    href="${gameLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <span>
                        ⇩
                    </span>

                    <span>
                        Download
                    </span>

                </a>

            `;


            /* =========================
               CARD
            ========================= */

            card.innerHTML = `

                <div class="logo">

                    ${logoHTML}

                </div>


                <div class="details">


                    <div class="game-name">

                        ${escapeHTML(
                            game.name ||
                            "Game"
                        )}

                    </div>


                    <div class="signup-bonus">

                        Sign Up Bonus:
                        ${escapeHTML(
                            game.signup_bonus ||
                            "N/A"
                        )}

                    </div>


                    <div class="minimum-withdrawal">

                        Minimum Withdrawal:
                        ${escapeHTML(
                            game.minimum_withdrawal ||
                            "N/A"
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
                                game.rating ??
                                "N/A"
                            )}

                        </span>


                        <span class="separator">
                            |
                        </span>


                        <span class="size">

                            ${escapeHTML(
                                game.size_mb ??
                                "N/A"
                            )}

                        </span>


                    </div>


                </div>

            `;


            gameList.appendChild(
                card
            );

        }
    );
}


/* =================================
   SEARCH
================================= */

const search =
    document.getElementById(
        "search"
    );


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
    document.getElementById(
        "yonoTab"
    );


const otherTab =
    document.getElementById(
        "otherTab"
    );


if (yonoTab) {

    yonoTab.addEventListener(
        "click",
        function() {

            currentTab =
                "yono";


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

            currentTab =
                "others";


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
