# Simultaneous Combat System

![Version](https://img.shields.io/github/v/tag/arcanistzed/scs?label=Version&style=flat-square&color=2577a1) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/scs/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/arcanistzed/scs/main/module.json&style=flat-square&color=ff6400) [![Discord Server](https://img.shields.io/badge/-Discord-%232c2f33?style=flat-square&logo=discord)](https://discord.gg/AAkZWWqVav) [![Patreon](https://img.shields.io/badge/-Patreon-%23141518?style=flat-square&logo=patreon)](https://www.patreon.com/bePatron?u=15896855)

A beautiful mostly system-agnostic and completely customizable implementation of a Simultaneous Combat System. See the [Reddit post](https://redd.it/p11h35) from the author.

Have you ever tired of waiting for the turns of your friends to be over? Are you fed up with your players taking so long in *every* combat encounter? Do you feel like changing things up in your game and trying something new?

![gradient](https://user-images.githubusercontent.com/82790112/123046244-ddeb3a80-d3c9-11eb-98db-da2f4a6abd68.gif)

## Installation

In the setup screen, use the URL `https://github.com/arcanistzed/scs/releases/latest/download/module.json` to install the module.

## Usage

Please follow the built-in tutorial (built with IntroJS), for instructions. You can always relaunch the tutorial from within the settings. If you have any questions, feel free to contact me.

## Support

Please consider supporting me on [my Patreon](https://patreon.com/arcanistzed) if you like my work. You can see a list of all my projects on [my website](https://arcanist.me).

## Features

### Action Locking

In supported systems, SCS will detect whether the current phase has been registered with the module and will restrict what can be done on your turn accordingly.

If you would like to add support for another system or more phases, please make a PR or let me know on my Discord (link is below) and I will happily take suggestions.

Currently only DnD5e is supported with the default phases as described in the reddit post linked above.

When using BetterRolls5e or MidiQoL, you will get this warning from libWrapper which is safe to ignore:

```txt
libWrapper: Potential conflict detected between module 'scs' and module 'betterrolls5e'.
Module 'scs' did not chain the wrapper for 'CONFIG.Item.documentClass.prototype.roll'.
```

### Phase and Round display

The module will display the current phase and round in an interactive and draggable app. You can use the arrows to change phase (`<` or `>`) and change round (`<<` or `>>`), or you can simply click on the phase you would like to switch to (not recommended if using phase/cycle limits).

### Integration with the Core Combat Tracker

This module updates the Combat Tracker as you use it for better compatibility, but hides the buttons for changing turns. This module also prevents any turns to be assigned, so that you don't see any highlighting for such in the Combat Tracker.
SCS prompts to end combat whenever the round is equal to zero and will start a new combat if there is none when loading. The module will end the combat when all the combatants are removed.
There is also a setting to hide the default Combat Tracker.

### Hides itself when there is no Combat

When enabled, once the combat has ended or all of the combatants have been removed, the app will hide itself. It will show itself again when a new combat is created.
You can use this feature without the default Combat Tracker by simply adding and removing combatants in the Token HUD when combat is beginning or is over.

### Attack Roll Display

In order to ease determining the attack order (for example, in the default attack phase), the module shows you the last attack roll either next to the token or in the Combat Tracker. This currently only works in DnD5e and PF2e.

### Keybindings

You can switch the phase, current round, or toggle the app's visibility with keybindings.

### Integration with other modules

#### [SmallTime](https://foundryvtt.com/packages/smalltime)

The app moves outside of SmallTime's way and locks into place right above it.

#### [Simple Calendar](https://foundryvtt.com/packages/foundryvtt-simple-calendar) and [About Time](https://foundryvtt.com/packages/about-time)

Works alongside the realtime clock by manipulating the Combat Tracker in the background, therefore the clock will be paused when the round is not zero and the game time will be changed when the round is changed.

#### [Argon Combat HUD](https://foundryvtt.com/packages/enhancedcombathud)

This module hides Argon's "End Turn" button.

#### [Better Rolls 5e](https://foundryvtt.com/packages/betterrolls5e)

The Attack Display parses and handles Better Rolls' chat messages to allow it to display attack rolls made with the module.
Please note that SCS may have difficulty determining the correct token to add the display to if you use Better Rolls to roll for linked tokens. To get the right result, you can select the token before rolling for attack. If that doesn't work, make sure you only have one token from that Actor on the map.

### Change Colors

Clicking this button will generate new random colors for the phases!

### Limit Phases

This setting will automatically switch the round at the end of the cycle of all phases. You can also do this with Maximum Cycle set to 1 and Limit Cycles enabled.

### Limit Cycles & Maximum Cycle

This setting will put a limit on how many cycles can take place before switching to the next round. For example, if Maximum Cycle is set to 3, after each phase has been completed three times, it will be the next round. It is recommended using the arrows to navigate between phases when using this.

## API

### Methods

SCS has a small API with a few methods that can be called by others. They are accessible under `game.modules.get("scs")?.api`.

#### `changeVisibility(state)`

This will change the visibility of the SCS Application. You cen either set `state` to `true` to display the App or to `false` to hide it.

#### `defaultTracker(hide = true)`

This will elegantly hide the default combat tracker from the sidebar. An optional Boolean parameter can be used to show the tracker again, if hidden.

#### `startTutorial()`

This will show the IntroJS tutorial tour once.

#### `stopTutorial(close = false)`

This will stop the tour from showing every time the page is loaded unless the user re-enabled the tutorial from within the module settings.
An optional Boolean parameter can be used to also immediately close the tutorial, but this defaults to `false`.

#### Deprecated: `changeRound(delta)`

~~An asynchronous method that changes the SCS's round by a given delta. Note that this will also change the Core round. Use a positive number for the delta to move the round forward and a negative number to go to previous rounds.~~

Use `game.combat.nextRound()` or `game.combat.previousRound()` instead.

#### `changePhase(delta)`

An asynchronous method that changes the SCS's phase by a given delta. Use a positive number for the delta to move the phase forward and a negative number to go to previous phase.

### Hooks

This module has two hooks which are only called on the GM's client:

#### Deprecated: `scsRoundChanged`

~~This hook is called whenever the SCS round changes. It has three arguments which are (in order): the current phase, the previous phase, and the delta.~~

Use the `updateCombat` hook and check the `change.round` value instead.

#### `scsPhaseChanged`

This hook is called whenever the SCS phase changes. It has three arguments which are (in order): the current phase, the previous phase, and the delta.

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/scs/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Localization

Please note that the `Phases` must be short enough to fit their boxes, so you shouldn't put anything over approximately eight characters.

## Contact me

Come hang out on [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=Simultaneous%20Combat%20System%20module).

## License

Copyright © 2021 arcanist

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

See the [Notice](./NOTICE.md) for attribution details.
