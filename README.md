PRunk: The Unpredictable Race
=====

An Online Multiplayer 2D Runner Game

---

General idea
------------

    Online Multiplayer 2D Runner Game
    
    1 vs 1 obstacle race
    
    Spectating players can influence the game
    
    Target audience:
    Twitch/Youtube streamers and their viewers

Gameplay: what streamers play
-----------------------------

	Goal: Arrive first
    
    Stage: Race track divided in pre-built blocks, randomly arranged
    
    Controls: space / ↓ for jumping/crouching
              QWER for abilities/usable items (not always available)
    
    Opponents can see each other in-game
    
    No direct interaction
    A player cannot block/attack their opponent

Gameplay: what viewers play
---------------------------

    At the beginning of every block,
    a set of choices will be displayed
    
    At the end of the block,
    the most voted choice will influence the game
    
    Due to video stream lag (~12-40 secs on Twitch.tv), the viewers will not immediately see the result of their vote
    
    The viewers will choose from a variety of game objects, character abilities and equipment
    
    The final choice may influence the player positively, but also negatively!

Technologies and libraries
--------------------------

    Streamers Front-End:
        Quintus Game Engine

    Viewers Front-End:
        Basic HTML+CSS+JS
        Embedded Twitch/Youtube stream player

    Back-end:
        Node.js / Express.js
