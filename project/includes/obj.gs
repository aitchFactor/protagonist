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

var this_direction;


# var animation_start;
proc sprite_boot {
    if true{
        delete_this_clone;
    }
    clear_graphic_effects;
    clone_id = "root";
    x_position = 0;
    y_position = 0;
    z_position = 0;

    this_direction = 90;
    

    x_scroll = 0;
    y_scroll = 0;

    animation_counter = 0;
    animation_start = false;
    animation_play_state = AnimationPlayState{};

    delete animations_queue_header;
    delete animations_queue_frames;
    delete current_animation_buffer;

    last_hurtbox = 0;
    set_size 100;

    set_rotation_style_left_right;

    state = "boot";
    
}

struct AnimationHeader {
    num_pages, # total frames in the animation
    loop_start = -1, # relative to the frame block, not the costume number. (might change though)
    # TODO: loop end? outro?
    loop_mode = -1, # forwards or bidi 
    loops   =   0, # -1 = infinite
}

list AnimationHeader animations_queue_header;

struct AnimationFrame {
    costume_name,
    duration = 1,
    flip = false # note: this is very dodgy right now.
}
list AnimationFrame animations_queue_frames; # drop the AnimationFrames here to be unpacked.




struct AnimationPlayState {
    playing_time = 0,

    loop_start_frame = 0,

    total_frames = "Infinity"
}


var AnimationPlayState animation_play_state;
list current_animation_buffer;

proc load_next_animation {
    animation_counter = 0;

    local AnimationHeader animation_header = animations_queue_header[1];
    delete current_animation_buffer;
    local i = 0;
    repeat animation_header.num_pages{
        
        if i == animation_header.loop_start{
            animation_play_state.loop_start_frame = length current_animation_buffer * 0.5;
        }

        local AnimationFrame animation_frame = animations_queue_frames[i + 1];

        repeat animation_frame.duration {
            add animation_frame.costume_name to current_animation_buffer;
            add animation_frame.flip to current_animation_buffer;
        }
        i++;
    }


    if animation_header.loops < 0 {
        animation_play_state.total_frames = "Infinity";
    }
    else {
        local loop_length = (length current_animation_buffer)*0.5 - animation_play_state.loop_start_frame;
        animation_play_state.total_frames = animation_play_state.loop_start_frame + loop_length * (1 + animation_header.loops);
    }
}

proc force_animation_refresh {
    # Force an animation to play from the beginning.
    animation_play_state = AnimationPlayState{};
}

proc clear_animation {
    # Refresh and clear any current animations.
    force_animation_refresh;
    delete animations_queue_header;
    delete animations_queue_frames;
}

var flipped;

proc animation_player {

    if animation_play_state.playing_time == 0{
        if length animations_queue_header == 0{
            # There's nothing queued; don't play anything. 
            stop_this_script;
        }
        load_next_animation;
    }

    local frame = "";
    local start = animation_play_state.loop_start_frame;
    if animation_counter < start{
        frame = animation_counter;
    }
    else{
        local loop_length = (length current_animation_buffer)*0.5 - start;
        frame = start + (round(animation_counter - start) % loop_length);

    }
    frame = round(frame);
    switch_costume current_animation_buffer[(2 *frame) + 1];
    # "Flip" parameter
    flipped = current_animation_buffer[(2 * frame) + 2];


    animation_play_state.playing_time += delta_time;

    if round(animation_counter) >= animation_play_state.total_frames {
        repeat animations_queue_header[1].num_pages{
            delete animations_queue_frames[1];
        }
        delete animations_queue_header [1];
        animation_play_state = AnimationPlayState{};
        delete current_animation_buffer;

        # recursive call 
        animation_player;
    }
    

}

proc one_frame costume_name {
    clear_animation;
    # Header
    add AnimationHeader {
        num_pages: 1,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: $costume_name,            duration: 1,    flip: false  } to animations_queue_frames;

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

    point_in_direction this_direction * (-bool_to_sign(flipped));


    set_size 800;
    goto round(x_position + x_scroll) * 2, round(y_position + y_scroll) * 2;
    set_size 200;


}

on "tick_cosmetics"{
    last_hurtbox = costume_number();
}

on "tick_animation"{
    animation_player;
}