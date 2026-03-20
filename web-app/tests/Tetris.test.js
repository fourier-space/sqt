import Tetris from "../Tetris.js";
import R from "../ramda.js";

describe("Hold", function () {
    it(
        `A held tetromino can be retrieved on a subsequent turn:
        Given a Tetris Game;
        When the sequence Hold > Hard Drop > Hold is performed;
        Then the current tetromino before and after the sequence, is the same.`,
        function () {
            const initial_game = Tetris.new_game();
            const initial_tetromino = initial_game.current_tetromino;
            // You'll need to implement Tetris.hold before this works.
            const final_game = Tetris.hold(
                Tetris.hard_drop(
                    Tetris.hold(initial_game)
                )
            );
            const final_tetromino = final_game.current_tetromino;
            if (!R.equals(initial_tetromino, final_tetromino)) {
                throw new Error(
                    `The initial and final tetrominoes do not match
                    Initial: ${JSON.stringify(initial_tetromino)}
                    Final:   ${JSON.stringify(final_tetromino)}`
                );
            }
        }
    );

    it(
        `Hold can't be performed twice in a row:
        Given a Tetris Game where a Hold is performed;
        When one further Hold is performed;
        Then the game state before and after the second hold, is the same.`,
        function () {
            const initial_game = Tetris.hold(Tetris.new_game());
            // Implement the rest of this test.
        }
    );

    it(
        `### Change this to your test description ###`,
        function () {
            // Implement this test.
            throw new Error("Unimplemented");
        }
    );
});