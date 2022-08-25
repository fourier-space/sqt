import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;
const minigrid_rows = 6;
const minigrid_columns = 6;


let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);
document.documentElement.style.setProperty("--minigrid-rows", minigrid_rows);
document.documentElement.style.setProperty("--minigrid-columns", minigrid_columns);

const grid = document.getElementById("grid");
const minigrid = document.getElementById("minigrid");

const range = (n) => Array.from({ "length": n }, (ignore, k) => k);

const cells = range(grid_rows).map(function() {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function() {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const minicells = range(minigrid_columns).map(function() {
    const minirow = document.createElement("div");
    minirow.className = "minirow";

    const minirows = range(minigrid_rows).map(function() {
        const minicell = document.createElement("div");
        minicell.className = "minicell";

        minirow.append(minicell);

        return minicell;
    });

    minigrid.append(minirow);
    return minirows;
});

const update_minigrid = function() {

    minicells.forEach(function(line, line_index) {
        line.forEach(function(block, column_index) {
            const cell = minicells[line_index][column_index];
            cell.className = "minicell";
            cell.backgroundColor = "";
        });
    });

    game.next_tetromino.grid.forEach(function(line, line_index) {
        line.forEach(function(block, column_index) {
            const minicell = minicells[line_index + 2][column_index + 1];
            minicell.className = `minicell ${block}`;
        });
    });

};

const update_grid = function() {
    game.field.forEach(function(line, line_index) {
        line.forEach(function(block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function(coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    update_minigrid();
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function() {
    key_locked = false;
};

document.body.onkeydown = function(event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    update_grid();
};

const timer_function = function() {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

// build function for mini grid to display next_tetromino//


setTimeout(timer_function, 500);

update_grid();