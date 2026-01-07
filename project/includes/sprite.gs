%include includes/sprite-engine.gs
%include includes/utils.gs

### Scripts - sprites importing this file will contain this script.
var SPRITE_NAME = "Unnamed Sprite";
var clone_id = "root";
var z_position = "-Infinity";

var x_position;
var y_position;


# note: scroll values are local; use a manager sprite to sync sprite scrolls on different layers
var x_scroll;
var y_scroll;

var last_hurtbox; # hurtbox also means collision boxes.

var state;

var animation_counter;

struct AnimationFrame {
    costume_name = "header",
    duration = 1,
    flip = false
}

struct AnimationHeader {
    loop_start = -1, # relative to the frame block, not the costume number. (might change though)
    loop_mode = -1, # forwards or bidi 
    loops   =   0,
    priority = 1, # lower = plays first;
    erase   = 0 # clear this number of queued animations after playing; -1 = clear all 
}

list animation_queue;


proc sprite_boot {
    if true{
        delete_this_clone;
    }
    clear_graphic_effects;
    clone_id = "root";
    x_position = 0;
    y_position = 0;
    z_position = 0;

    x_scroll = 0;
    y_scroll = 0;

    animation_counter = 0;
    
    last_hurtbox = 0;
    set_size 100;

    state = "boot";
    
}

on "boot"{
    sprite_boot;
}

on "tick_zsort" {
    sort_depth z_position, false;
}

on "tick_000"{
    switch_costume last_hurtbox;
    set_size 800;
    goto x_position + x_scroll, y_position + y_scroll;
    set_size 100;

}

on "tick_display"{
    # round the "true" positional values to smooth out floating point error
    x_position = round_16(x_position() - x_scroll);
    y_position = round_16(y_position() - y_scroll);
    x_scroll = round_16(x_scroll);
    y_scroll = round_16(y_scroll);


    set_size 800;
    goto round(x_position + x_scroll) * 2, round(y_position + y_scroll) * 2;
    set_size 200;


}

on "tick_cosmetics"{
    last_hurtbox = costume_number();
}