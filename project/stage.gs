%include includes/structs.gs
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


list Projectile projectile_queue;

list PlayerEvent player_events;

list Solid Solids;

var hitbox_view;
var show_scroll_target;
var debug = true;
var debug_show_checkpoints;
# switch off to disable players from using frame advance on their own.
var debug_frame_advance = true;
list debug_log;

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
var camera_target_y_max;
var camera_target_y_min;

# "" means calculate automatically
var camera_x_min;
var camera_x_max;
var camera_y_min;
var camera_y_max;



enum CameraMode {
    Player, # normal gameplay
    FreeTarget, # something else sets the target with panning handled as normal
    FreePan     # something else controls all camera movement
}
var camera_mode;

var player_spawn_chunk_x;
var player_spawn_chunk_y;

var area_transition_direction;

var chunk_query_x;
var chunk_query_y;

list CollisionCheck collision_checks;

list CollisionCheck collision_colour_checks;

var paused;

var acc;




var MapInfo map_info;

# An array determining which map is loaded if a level transition enters some chunk. 
list map_lut;

# A list of maps that could be loaded in this level.
list MapInfo map_list; 



# checkpoints for the current stage.
list Checkpoint checkpoints;
var current_checkpoint_index;


var Checkpoint mini_checkpoint;
var respawn_mode;
enum RespawnMode {
    Big,
    Small
}

var ChunkInfo chunk_info;
