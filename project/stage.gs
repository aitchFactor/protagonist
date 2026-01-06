# This is the Stage, list more backdrops separated by comma.
costumes "gfx/bg/black.png";
var G_game_state;
var fps;

list z_positions;
list input;

list mus_queue;
list sfx_queue;

list hitboxes;
list hurtboxes;

struct Solid{
    name    = "",
    prop1   = -1,
    prop2   = -1,
    prop3   = -1,
}


list Solid Solids;
# TODO