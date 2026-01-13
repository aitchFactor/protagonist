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

struct Projectile{
    type        = "",
    name        = "",
    lifetime    = 0,
    direction   = 0,
    x_position  = 0,
    y_position  = 0,
    xvel = 0,
    yvel = 0,
    follow = ""
}

enum BgLayerType {
    None    = "root",
    Picture = "gfx",
    Solid   = "solid",
    Soft    = "soft"
    # maybe some gimmicky parallax stuff as well
    # or horizontal one-way walls 
}
# What could possibly go wrong?
# For more entities with colours that could interfere with this process, we could have all non-solids ghost themselves at the beginning of a tick.
# Note: up to 14 bits can be packed in a colour value; the top 5 bits of red and green and the top 4 bits of blue.
enum BgLayerTypeColour {
    None    = "0x000000",
    Picture = "0xf8f8f0",
    Solid   = "0x00f800",
    Soft    = "0x00f8f8"
}

enum BgLayerTypeBit {
    # None    = "0x000000",
    # Picture = "0xf8f8f0",
    Solid   = 1,
    Soft    = 2
}

list Projectile projectile_queue;


list Solid Solids;

var hitbox_view;

var fps_switch;

# player 1: halli
# player 2: pafu
var player = 1;

var camera_x;
var camera_y;
var camera_target_x;
var camera_target_y;

# costume name of the top-left corner of the map. 

struct MapInfo {
    map_name = "",
    # all coordinates measured in chunk size.
    map_left_edge   = 0,
    map_top_edge    = 0,
    map_right_edge  = 0,
    map_bottom_edge = 0,
}

var MapInfo map_info;

struct ChunkInfo {
    viewport_x = 0,
    viewport_y = 0,
    chunk_x    = 0,
    chunk_y    = 0, 
    
}

var ChunkInfo chunk_info;
