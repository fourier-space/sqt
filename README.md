# Computing 2 Tetris Worksheet.
In this code repository is a module that can simulate a game of Tetris
`web-app/Tetris.js`
and a web app to play the game.
`web-app/index.html`

The module and app will play a tetris game,
but are missing some features that you might expect.
(For comparison, see https://tetris.com/play-tetris)

This assignment will have you implement some additional features,
which are targeted to the module assessment criteria.

## Setup
* Run `npm install` in the root directory to install server dependencies (ramda etc.)

## Task: Tetrominoes

### Colourful blocks
In Tetris, each type of tetromino has a different colour.
In this version they're all blue.

**Change the css such that each tetromino has a different colour.**

### Next Tetromino Preview
Part of the game state is the next tetromino to descend after the current one
locks.
In most tetris games this is displayed to the player.
In this module the next tetromino is stored as a property of the game object.
`game.next_tetromino`.

* Unlike in the online game, you should only show the **one** next tetromino.

**Add a display of the next tetromino to the sidebar**

### Hold Tetromino
One feature you often see in Tetris games is the ability to *hold* a tetromino.
If you press hold, `c`, then the current tetromino is taken off the field and held.
If there was no tetromino already held, then the next tetromino is deployed,
otherwise if there is a tetromino already held then it is deployed.
In each case the tetromino is deployed from the top of the field.
Once you hold a tetromino, you can't hold again until you have locked in a tetromino.

See https://tetris.com/play-tetris for an example of how this works.

**You are going to implement the hold mechanism.**
1. Add to the documentation of type definition of a `Tetris.Game` (line 16) two fields:
    1. `held_tetromino`, the tetromino you are holding.
    2. `can_hold`, a boolean that determines if holding is allowed.
2. Modify the `Tetris.new_game()` function to have these new fields, and have sensible initial values.
3. Modify `Tetris.next_turn()` so that the next turn returned also has these two fields.
4. Document in **jsdoc** a new function `Tetris.hold()` that takes a game, and returns a new game with the current tetromino held.
5. Implement the `Tetris.hold()` function as specified.
6. Modify `main.js` to listen for the `c` key being pressed, and holds the tetromino when triggered.
7. Add a display of the held tetromino to the UI.

### Hold Tetromino - Unit Tests
We are going to test three behaviours of the hold mechanism.
1. A held tetromino can be retrieved on a subsequent turn.
2. Hold can't be performed twice in a row.
3. If there is no held tetromino and a hold is performed, the *next tetromino* is deployed.

Use the starter code in `web-app/tests/Tetris.test.js`.

For the first test, I have specified using Given-When-Then for this behaviour
and have implemented the test. You need not modify this one.

For the second test, I have provided a Given-When-Then specification for the test.
**You should implement this test**

The third test,
*If there is no held tetromino and a hold is performed, the **next tetromino** is deployed.*,
needs to be further specified and implemented by you.

**Further specify and implement this test**

Are there any more tests that could be specified for this feature?

Are there any tests you can specify for the next tetromino preview feature?

## Task: Score System
You have been provided with an implementation of a tetris game.
In this version, there is no scoring implemented
and no acceleration of the game as lines are cleared.

Your task will be to implement a scoring system.

In Tetris, points are scored by dropping tetrominoes, and clearing lines.
For every ten lines that are cleared, the game advances a level,
and the speed that tetrominoes descend increases,
as well as each line cleared scores more points.

We'll be looking at a simplified version of the Tetris Guidelines: https://tetris.wiki/Scoring.

### Score Object

In `Score.js`, we define a module, `Score`, which will host methods to
create and manipulate a score object.

Initially the `Score` type is just a number, and the function `new_score`
will return a number, zero.

We will modify the type of the score, so that it is an object that holds
both the score and the number of lines cleared.
i.e.,
```javascript
{
    "score": 0,
    "lines_cleared": 0
}
```

1. Modify the `new_score` function so that instead of returning `0`, it returns an object with `"score"` and `"lines_cleared"` properties as above.
1. Update the [jsdoc](https://jsdoc.app/) of the `Score` type definition `@typedef {number} Score` to indicate that an object is returned and list its properties.
1. Modify the `level` function, to return what level you are on, based on an input `Score` object.
    * You start at level 1, and advance a level every 10 lines cleared.
1. Add a jsdoc comment to `level` to describe what it does, what it's parameters are, and what it returns.

### Display
After you've done the above, you are going to want to display the current score to the user playing the game.

1. Modify `index.html`, so that in the `<aside>` there is a template for,
    1. What the current score is
    1. How many lines have been cleared
    1. What the current level is.
1. Modify `main.js`, so that the `update_grid` function reads the `Score` object on `game.score` and updates the html elements you've just added.

At this stage, it will always display a score of zero, zero lines cleared, and we're on level one. This is because we've not yet added any functionality to change the score.

### Scoring
We are going to implement the following ways to score,
* Clearing lines
* Dropping tetrominoes

When clearing lines, you get more points for multiple lines cleared at once.
* Single line – 100 points per level
* Double lines – 300 points per level
* Triple lines – 500 points per level
* Tetris – four lines – 800 points per level
* Back-to-back Tetris – Scoring a tetris if the previous line clear was also a tetris – 1200 points per level.

We are going to implement a way to record this.

1. Define a new `cleared_lines` function in `Score.js` on the `Score module`.
1. `cleared_lines` takes the number of lines and a `Score` object as parameter, and returns a new `Score` with additional lines cleared and the score updated.
1. Update the definition of the `Score` type and the `new_score` object to log if the last line cleared was a tetris. Use this in `cleared_lines` to score back-to-back tetrises.

We need to update the score when we clear lines.
In `tetris.js` in the `Tetris.next_turn` function, there is a call to clear filled lines,

```javascript
const cleared_field = clear_lines(locked_field);
```

Right before this happens, we need to determine how many full lines are on the board and update the score accordingly.

1. Study how the `clear_lines` function works. It rejects the filled lines in a field. We can use a similar approach with `R.count` and `is_complete_line` to count the number of lines
1. Store in a variable the number of lines ready to be cleared, before we call `clear_lines`.
1. Call `Score.cleared_lines` with that number to get a new score, and have that new `Score` object be returned in within the game object when the function returns.

Now when playing the game, the score and the level should update as you clear lines.

We also want the score to increase by 1 point on a soft-drop (when the tetromino descends faster - i.e. by pressing `[down]` on the keyboard).
and the score to increase by 2 point on a hard-drop (when the tetromino drops as far as possible and immediately locks  - i.e. by pressing `[space]` on the keyboard)

This is probably best accomplished by modifying the
`descend` function in `Tetris.js`
1. Add a function `add_points` to `Score.js` that adds a given number of points to a given score.
1. Modify the `descend` function to take an numeric parameter, `points`, default value zero.
1. Where it returns a new game state, `return R.mergeRight(game, {"position": new_position});` with an updated position, update this to update the score with the given number of points.
1. Update the call to `descend` in `Tetris.soft_drop` and `Tetris.hard_drop` to score 1 and 2 points every descent respectively.

### Speed
We want the game to get harder each level.
Currently the game advances every 500 ms.

1. In `main.js` in `timer_function`, update the time of the next turn to be `2500 / (level + 4)`. Where `level` is determined from running the level function on the score object on the game.
1. This should get faster every level, play with the values for a good feel of the speed and acceleration.

### Unit Tests
Our unit tests should reflect the rules of the features we've just added.
Let's review them.
* A new tetris game starts on level one with no lines cleared with a score of zero.
* The score tracks the lines that get cleared.
* A single line clear scores 100 × level
* A double line clear scores 300 × level
* A triple line clear scores 500 × level
* A tetris scores 800 × level
* Back to back tetrises score 1200 × level
* A soft drop score 1 point per cell descended
* A hard drop score 2 point per cell descended
* Advancing the turn without manually dropping scores nothing.
* Locking in a tetromino without manually dropping or clearing a line scores nothing.

These can be the top level descriptors of our tests.

1. Read the implementations in `tests/Score.test.js` and implement the missing tests.
