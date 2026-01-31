%include includes/obj.gs
%include includes/structs.gs
%include gfx/bg/step3/data.gs
%include includes/utils.gs
costumes "gfx/bg/step3/cave-sparkle*.png";
var SPRITE_NAME = "Cave Sparkle";

proc anim_sparkle {
    clear_animation;
    add AnimationHeader {
        num_pages: 8,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "cave-sparkle_2",      duration: 3,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_3",      duration: 3,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_4",      duration: 3,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_5",      duration: 3,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_4",      duration: 3,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_3",      duration: 3,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_2",      duration: 3,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "cave-sparkle_1",      duration: 1,   flip: true } to animations_queue_frames;
}
on "boot" {
    boot;
    # spawn;
}
var CYCLE_LENGTH = 22;

proc boot {
    z_position = 256;
    anim_sparkle;
    hide;
    hidden = true;
    goto_random_position;
    x_position = x_position() * 0.5;
    y_position = y_position() * 0.5;
    animation_player;
    animation_counter = random(0, floor(CYCLE_LENGTH / 2)) * 2;
    depth = random (0.25, 0.85);
}

proc spawn {
    repeat 8 {
        spawn_clone("sparkle");
    }
}

on "tick_cosmetics" {
    animation_counter += delta_time;
    animation_counter = round_256(animation_counter);
}

on "tick_303" {
    if animation_counter >= CYCLE_LENGTH * 2 {
        animation_counter -= CYCLE_LENGTH;
        x_position = random (-visible_width * 0.5, visible_width * 0.5);
        y_position = random (-visible_height * 0.5, visible_height * 0.5);
        depth = random (0.25, 0.8);
    } 
    x_scroll = ((x_position - camera_x * depth) % visible_width) - visible_width * depth;
    y_scroll = ((y_position -camera_y * depth) % visible_height) - visible_height * depth;
}
on "map_reloaded" {
    if true {
        delete_this_clone;
    }

    if map_info.spawn_checkpoint_index == get_step3b().spawn_checkpoint_index {
        spawn;
    }
    else {
        hide;
    }
}

onclone {
    boot;
    
    hidden = false;
    show;

}