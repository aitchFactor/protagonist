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

    x_scroll = 0;
    y_scroll = 0;

    animation_counter = 0;
    animation_start = false;
    animation_play_state = AnimationPlayState{};

    delete animations_queue;
    delete animation_unpack_waiting_area;
    delete current_animation_buffer;

    last_hurtbox = 0;
    set_size 100;

    state = "boot";
    
}

struct AnimationHeader {
    loop_start = -1, # relative to the frame block, not the costume number. (might change though)
    # TODO: loop end? outro?
    loop_mode = -1, # forwards or bidi 
    loops   =   0, # -1 = infinite
    num_pages = 0, # total frames in the animation
    priority = 1, # lower = plays first?
    erase   = 0 # (do I need this?) clear this number of queued animations after playing; -1 = clear all 
}
list AnimationHeader animations_queue;

struct AnimationFrame {
    costume_name,
    duration = 1,
    flip = false
}
list AnimationFrame animation_unpack_waiting_area; # drop the AnimationFrames here to be unpacked.




struct AnimationPlayState {
    playing_time = 0,

    loop_start_frame = 0,

    end_frame = "Infinity"
}


var AnimationPlayState animation_play_state;
list current_animation_buffer;
proc animation_player {
    if animation_play_state.playing_time == 0{
        # Unpack animation frames into a lookup table (binary search is probably worse due to JSON limits)
        local i = 0;
        local animation_header = animations_queue[1];
        delete current_animation_buffer;

        repeat length(animation_unpack_waiting_area){

            if i == animation_header.loop_start{
                animation_play_state.loop_start_frame = length current_animation_buffer;
            }

            local animation_frame = animation_unpack_waiting_area[1];

            repeat animation_frame.duration {
                add animation_frame.costume_name to current_animation_buffer;
                add animation_frame.flip to current_animation_buffer;
            }
            delete animation_unpack_waiting_area[1];

            i++;
        }


        if animation_header.loops < 0 {
            animation_play_state.total_frames = "Infinity";
        }
        else {
            local loop_length = (length current_animation_buffer) - animation_play_state.loop_start_frame;
            animation_play_state.total_frames = animation_play_state.loop_start_frame + loop_length * (1 + animation_header.loops);
        }



    }
    local frame = ""
    local start = animation_play_state.loop_start_frame;
    if animation_counter < start{
        frame = animation_counter;
    }
    else{
        local loop_length = (length current_animation_buffer) - start;
        frame = start + ((animation_counter - start) % loop_length);

    }
    frame = round(frame)
    switch_costume current_animation_buffer[frame + 1];

    animation_play_state.playing_time += delta_time;

    if animation_play_state.playing_time > animation_play {
        delete animations_queue [1];
        animation_play_state = AnimationPlayState{};
        delete current_animation_buffer;
    }
    

}


proc animation_seek_frame {
    # updates state to the frame that needs to be displayed now.
    # This should be the next one but it could skip a few if the animation is fast.

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

on "tick_animation"{

}