# import for sprites that are displayed on the screen.
# features (TODO):
# - z-sorting
# - animation
# - global position offset
# - postprocess upscaling
# clones?

# What's the best way to specify the sprite name?
enum Axes {
    x,
    y
}

var SPRITE_NAME = "None";
var clone_id;
var z_position = "-Infinity";

var x_position;
var y_position;

var x_scroll;
var y_scroll;





proc sort_depth z_position, flicker {
    local i = 1;
    if not $flicker {
        until not ($z_position < z_positions[i + 1]) {
            i += 2;
        }
    }
    else {
        until $z_position > z_positions[i + 1] {
            i += 2;
        }
    }
    insert $z_position at z_positions[i];
    insert SPRITE_NAME & " " & clone_id at z_positions[i];
    go_forward i - 1;
}
