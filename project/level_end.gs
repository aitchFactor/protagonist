%include includes/obj.gs
costumes "blank.png", "gfx/misc/*.png";

var yvel;
var SPRITE_NAME = "Level End Cube";
proc anim_live {
    clear_animation;
    add AnimationHeader {
        num_pages: 3,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "level_end_cube1",      duration: 8,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "level_end_cube2",      duration: 8,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "level_end_cube3",      duration: 8,    flip: false } to animations_queue_frames;
}
proc anim_dead {
    clear_animation;
    add AnimationHeader {
        num_pages: 3,
        loop_start: 2,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "blank",          duration: 30,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "teaser_1",      duration: 120,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "teaser_2",      duration: 1,    flip: false } to animations_queue_frames;
}

on "tick_303" {

    x_scroll = -camera_x; 
    y_scroll = -camera_y;
}

on "tick_cosmetics" {
    animation_counter += delta_time;
}
on "boot" {
    hide;
    z_position = 0;
    x_position = 1920 - 64;
    y_position = -1072 + 56;
    hidden = false;
    anim_live;
}

on "tick_202" {
    switch_costume "level_end_cube4";
    if touching("puff") or touching("player") {
        animation_player;
        anim_dead;
        G_game_state = "level_end";
        broadcast "level_fadeout";
        broadcast "level_end";


        spawn_clone costume_name();

        x_position = camera_x;
        y_position = camera_y;

    }

}

onclone {
    clear_animation;
    hurtbox = clone_id;
    switch_costume clone_id;
    yvel = 5;

}

on "tick_108" {
    if clone_id == "root" {
        stop_this_script;
    }
    yvel -= 0.1 * delta_time;

    y_position += yvel * delta_time;

    if y_position < camera_y - 16 {
        y_position = camera_y - 16;
    }


}


on "tick_display" {
    switch_costume clone_id;
}