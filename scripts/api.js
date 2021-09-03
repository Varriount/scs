// Import application
import scsApp from './app.js'

/**
 * Provides a public API
 */
export default class api {

    /** Adjust default combat tracker */
    static defaultTracker(hide = true) {
        // Hide or show combat tab
        const combatTab = document.querySelector("[data-tab='combat']");
        hide ? combatTab.style.display = "none" : combatTab.style.display = "block";

        // Adjust alignement to compensate for the missing tab
        document.querySelector("#sidebar-tabs").style.justifyContent = "space-between";
        Hooks.on("collapseSidebar", (_sidebar, collapsed) => {
            if (collapsed) document.querySelector("#sidebar").style.height = "auto";
        });
    };

    /** Start IntroJS tutorial tour */
    static startTutorial() {
        introJs().setOptions({
            steps: [{
                title: game.i18n.localize("scs.tutorial.welcome.Title"),
                intro: `<form id="scsWelcome"><p>${game.i18n.localize("scs.tutorial.welcome.Intro")}<p></form>`
            },
            {
                title: game.i18n.localize("scs.tutorial.howItWorks.Title"),
                intro: `${game.i18n.localize("scs.tutorial.howItWorks.Intro")}<ul>${scsApp.phases.names.map(name => `<li>${name}</li>`).join("")}</ul>`
            },
            {
                title: game.i18n.localize("scs.tutorial.combatTracker.Title"),
                element: document.getElementById("sidebar-tabs"),
                intro: game.i18n.localize("scs.tutorial.combatTracker.Intro")
            },
            {
                title: game.i18n.localize("scs.tutorial.movingAround.Title"),
                element: document.querySelector("#scsApp #currentRound"),
                intro: game.i18n.localize("scs.tutorial.movingAround.Intro")
            }],
            skipLabel: '<a><i class="fas fa-times"></i></a>'
        }).start();

        // Create "Don't Show Again" checkbox
        let stopButton = document.createElement("div");
        stopButton.id = "scsTutorialAgainDiv";
        stopButton.innerHTML = `<input id="scsTutorialAgain" type="checkbox"><label for="scsTutorialAgain">Don't show again</label>`;
        // Add it to the DOM
        document.querySelector(".introjs-tooltipbuttons").before(stopButton);

        // Stop tutorial when it's clicked
        stopButton.addEventListener("click", api.stopTutorial(false));
    };

    /** Stop showing IntroJS tutorial
     * @param {Boolean} close - Whether the tutorial should also immediately close (defaults to `false`)
    */
    static stopTutorial(close = false) {
        game.settings.set(scsApp.ID, "startupTutorial", false); // Don't show again
        if (close) document.querySelector(".introjs-skipbutton").click(); // Close tutorial if wanted
    };

    /** Change SCS round. Note that this will also change the Core round.
     * @param {Number} delta - The delta by which the round should change.
     * Use a positive number to move the round forward and a negative number to go to previous rounds.
    */
    static async changeRound(delta) {

        // Pull current values
        scsApp.pullValues();

        // Get previous round
        const previousRound = scsApp.currentRound;

        // If going forwards, reset to phase 1; if going back, reset to max phase
        scsApp.currentPhase = delta > 0 ? 1 : scsApp.phases.count;

        // If more than or equal to zero + the delta, change round by delta; else, notify user
        if (scsApp.currentRound + delta >= 0) { scsApp.currentRound += delta }
        else {
            scsApp.currentPhase = 1;
            ui.notifications.error("SCS | You cannot bring the current round below zero.");
        };

        // While delta is not zero, adjust Core round
        while (delta !== 0) {
            if (delta > 0) { // If positive, go to next round and bring delta towards zero
                await game.combat?.nextRound();
                delta--;
            } else { // If negative, go to previous round and bring delta towards zero
                await game.combat?.previousRound();
                delta++;
            }
        };

        // Update app to display new values
        scsApp.updateApp();

        // Fire a hook
        Hooks.call("scsRoundChanged", scsApp.currentRound, previousRound, delta);
    };

    /** Change SCS phase
     * @param {Number} delta - The delta by which the phase should change.
     * Use a positive number to move the phase forward and a negative number to go to previous phases.
    */
    static async changePhase(delta) {

        // Pull current values
        scsApp.pullValues();

        // If the phase would change to an invalid value, alert and exit
        if (scsApp.currentPhase + delta < 0 || scsApp.currentPhase + delta > scsApp.phases.count + 1) {
            console.error(`SCS | Cannot change phase by delta "${delta}", because that would bring it outside of the allowed bounds. Current phase: "${scsApp.currentPhase}".`);
            return;
        };

        // Get previous phase
        const previousPhase = scsApp.currentPhase;

        // Change phase by delta
        scsApp.currentPhase += delta;

        // Loop phases if limit cycles is enabled
        if (game.settings.get(scsApp.ID, "limitCycles")) {
            // Increment cycle if at the end of all phases
            if (scsApp.currentPhase === scsApp.phases.count + 1) scsApp.currentCycle += 1;

            // If the maximum amount of cycles is reached, loop and reset cycles
            if (scsApp.currentCycle > game.settings.get(scsApp.ID, "maxCycle")) {
                api.changeRound(1);
                scsApp.currentCycle = 1;
            };
        };

        // Change rounds if limit phases is enabled
        if (game.settings.get(scsApp.ID, "limitPhases")) {
            if (scsApp.currentPhase === scsApp.phases.count + 1) {
                api.changeRound(1);
            } else if (scsApp.currentPhase === 0) {
                api.changeRound(-1);
            };
        } else {
            // Loop over phases
            if (scsApp.currentPhase === scsApp.phases.count + 1) {
                scsApp.currentPhase = 1;
            } else if (scsApp.currentPhase === 0) {
                scsApp.currentPhase = scsApp.phases.count;
            };
        };

        // Correct phase if it excedes new limit
        if (scsApp.currentPhase > scsApp.phases.count) { scsApp.currentPhase = scsApp.phases.count }

        // Update app to display new values
        scsApp.updateApp();

        // Fire a hook
        Hooks.call("scsPhaseChanged", scsApp.currentPhase, previousPhase, delta);
    };
};

// Add API to the module's scope on init
Hooks.on("ready", () => game.modules.get(scsApp.ID).api = api);
