# This is the Stage, list more backdrops separated by comma.
costumes "gfx/bg/black.png";
var G_game_state;
var fps;

var delta_time;

var ctrl_up;
var ctrl_down;
var ctrl_left;
var ctrl_right;
var ctrl_a;
var ctrl_b;
var ctrl_x;
var ctrl_y;
var ctrl_sl; 
var ctrl_sr;
var ctrl_start;

list z_positions;
list input;

list mus_queue;
list sfx_queue;

list hitboxes;
list hurtboxes;

struct Solid{
    raw_name    = "",
    clone_name = "",
    prop1   = -1,
    prop2   = -1,
    prop3   = -1,
}


list Solid Solids;

var hitbox_view;

var fps_switch;

# player 1: halli
# player 2: pafu
var player = 1;