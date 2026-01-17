
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
    # This is for having multiple clones/sprites of one layer type each.
    None    = "root",
    Picture = "gfx",
    Solid   = "solid",
    Soft    = "soft",
    # maybe some gimmicky parallax stuff as well
    # or horizontal one-way walls 
}
# What could possibly go wrong?
# For more entities with colours that could interfere with this process, we could have all non-solids ghost themselves at the beginning of a tick.
# Note: up to 14 bits can be packed in a colour value; the top 5 bits of red and green and the top 4 bits of blue.
enum BgLayerTypeColour {
    None    = "0x000000",
    Picture = "0xf8f8f0",
    Solid   = "0x008000",
    Soft    = "0x008080",
    Spike   = "0x800000",
    Pogo    = "0x806000"
}

enum BgLayerTypeBit {
    # This is for colliding entities.
    # None    = "0x000000",
    # Picture = "0xf8f8f0",
    Solid   = 1,
    Soft    = 2,
    Spike   = 4,
    Pogo    = 8,
}

list Projectile projectile_queue;

struct PlayerEvent {
    type    = "",
    name    = "",
    sender  = "undefined",
}

list PlayerEvent player_events;

list Solid Solids;

var hitbox_view;
var show_scroll_target;
var debug_show_checkpoints;
# switch off to disable players from using frame advance on their own.
var debug_frame_advance = 1;

var fps_switch;

# player 1: halli
# player 2: pafu
var player = 1;

var camera_x;
var camera_y;
var camera_subpixel_x;
var camera_subpixel_y;
var camera_target_x;
var camera_target_y;
var camera_y_max;
var camera_y_min;

var player_spawn_chunk_x;
var player_spawn_chunk_y;

var paused;

# costume name of the top-left corner of the map. 

struct MapInfo {
    map_name = "",
    # all coordinates measured in chunk size.
    # these work like python slices: [0:3] -> [0, 1, 2]
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

struct Checkpoint {
    # chunk coords are where the checkpoint will be triggered.
    chunk_x = 0,
    chunk_y = 0,
    # spawn coords are where the player will respawn from.
    spawn_x = 0,
    spawn_y = 0
}

# checkpoints for the current stage.
list Checkpoint checkpoints;
var current_checkpoint_index;

var Checkpoint mini_checkpoint;

var ChunkInfo chunk_info;
