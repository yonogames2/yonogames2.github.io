console.log("SCRIPT START");


/* =========================
   SUPABASE SETTINGS
========================= */

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


/* =========================
   VARIABLES
========================= */

const gameList =
    document.getElementById("game-list");

const searchInput =
    document.getElementById("search");

const yonoTab =
    document.getElementById("yono-tab");

const othersTab =
    document.getElementById("others-tab");


let allGames = [];

let currentCategory = "yono";


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

    if (!gameList) return;

    gameList.innerHTML = `
        <div class="message">
            ${text}
        </div>
    `;
}


/* =========================
   SUPABASE CHECK
========================= */

if (!window.supabase) {

    console.error(
        "Supabase library load nahi hui."
    );

    showMessage(
        "❌ Supabase library load nahi hui."
    );

} else {

    console.log(
        "Supabase library OK"
    );


    const db =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    loadGames(db);
}


/* =========================
   LOAD GAMES
========================= */

async function loadGames(db) {

    try {

        console.log(
            "Loading games..."
        );


        const { data, error } =
            await db
                .from("games")
                .select("*")
                .eq("is_visible", true)
                .order("id", {
                    ascending: true
                });


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

            showMessage(`
                ❌ Supabase Error
                <br><br>
                ${error.message}
            `);

            return;
        }


        if (!data || data.length === 0) {

            showMessage(`
                ⚠️ Koi visible game nahi mila.
            `);

            return;
        }


        /* SAVE ALL GAMES */

        allGames = data;

        window.allGames = data;


        console.log(
            "Games loaded:",
            allGames
        );


        /* SHOW DEFAULT CATEGORY */

        filterGames();

    } catch (error) {

        console.error(
            "Connection Error:",
            error
        );

        showMessage(`
            ❌ Database connection failed
            <br><br>
            ${error.message}
        `);
    }
}


/* =========================
   FILTER GAMES
========================= */

function filterGames() {

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredGames =
        allGames.filter(game => {

            const category =
                String(
                    game.category || ""
                )
                .toLowerCase()
                .trim();


            const name =
                String(
                    game.name || ""
                )
                .toLowerCase();


            const categoryMatch =
                category === currentCategory;


            const searchMatch =
                name.includes(searchText);


            return (
                categoryMatch &&
                searchMatch
            );

        });


    console.log(
        "Filtered games:",
        filteredGames
    );


    if (filteredGames.length === 0) {

        showMessage(`
            ⚠️ Is category me koi game nahi mila.
        `);

        return;
    }


    showGames(filteredGames);
}


/* =========================
   SHOW GAMES
========================= */

function showGames(games) {

    gameList.innerHTML = "";


    games.forEach(game => {

        const card =
            document.createElement("div");


        card.className =
            "game-card";


        card.innerHTML = `

            <div class="game-logo-box">

                ${
                    game.logo_url
                    ? `
                        <img
                            src="${escapeHTML(game.logo_url)}"
                            class="game-logo"
                            alt="${escapeHTML(game.name || "Game")}"
                        >
                      `
                    : "🎮"
                }

            </div>


            <div class="game-info">

                <div class="game-name">
                    ${escapeHTML(
                        game.name || "Game"
                    )}
                </div>


                <div class="signup-bonus">
                    Sign Up Bonus:
                    ${escapeHTML(
                        game.signup_bonus || ""
                    )}
                </div>


                <div class="minimum-withdrawal">
                    Minimum Withdrawal:
                    ${escapeHTML(
                        game.minimum_withdrawal || ""
                    )}
                </div>

            </div>


            <div class="game-action">

                <button
                    type="button"
                    class="download-btn"
                >
                    ⇩<br>
                    Download
                </button>


                <div class="game-meta">

                    ★ ${
                        game.rating || ""
                    }

                    |

                    ${
                        escapeHTML(
                            game.size_mb || ""
                        )
                    }

                </div>

            </div>

        `;


        /* =========================
           DOWNLOAD BUTTON (UPDATED)
        ========================= */

        const downloadButton =
            card.querySelector(
                ".download-btn"
            );


        downloadButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                let link =
                    String(
                        game.playstore_link || ""
                    ).trim();


                console.log(
                    "DOWNLOAD CLICKED FOR:",
                    game.name
                );

                console.log(
                    "TARGET LINK:",
                    link
                );


                if (!link) {

                    alert(
                        "Download link available nahi hai."
                    );

                    return;
                }


                // Protocol fix (agar http/https miss ho)
                if (
                    !link.startsWith(
                        "http://"
                    ) &&
                    !link.startsWith(
                        "https://"
                    )
                ) {

                    link =
                        "https://" +
                        link;
                }


                /*
                   Play Store home page redirect issue bypass karne ke liye
                   link ko Chrome/Browser me new tab me open kar rahe hain.
                */

                window.open(
                    link,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );


        gameList.appendChild(card);

    });

}


/* =========================
   SEARCH
========================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            filterGames();

        }
    );
}


/* =========================
   YONO TAB
========================= */

if (yonoTab) {

    yonoTab.addEventListener(
        "click",
        function () {

            currentCategory =
                "yono";


            yonoTab.classList.add(
                "active"
            );


            othersTab.classList.remove(
                "active"
            );


            filterGames();

        }
    );
}


/* =========================
   OTHERS TAB
========================= */

if (othersTab) {

    othersTab.addEventListener(
        "click",
        function () {

            currentCategory =
                "others";


            othersTab.classList.add(
                "active"
            );


            yonoTab.classList.remove(
                "active"
            );


            filterGames();

        }
    );
}


/* =========================
   HTML ESCAPE
========================= */

function escapeHTML(value) {

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
