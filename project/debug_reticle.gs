costumes
"gfx/debug/reticle.png";
%include includes/utils.gs

on "tick_debug_last" {
    if not show_scroll_target {
        hide;
        stop_this_script;
    }
    goto_front;
    show;
    switch_costume "reticle";
    local target_y = camera_target_y;

    if clone_id == "min"{
        target_y = camera_target_y_min;
    }
    if clone_id == "max" {
        target_y = camera_target_y_max;
    }
    goto (camera_target_x - camera_x) * 2, (target_y - camera_y) * 2;

    # if clone_id == "tile"{
    #     goto ((quantise("player"."x_position", 16) - camera_x)  * 2), (quantise("player"."y_position", 16) - camera_y) * 2;
    # }
}

onflag {
    clone_id = "max";
    clone;
    clone_id = "min";
    clone;
    # clone_id = "tile";
    # clone;
    clone_id = "root";
}
onclone {
    if clone_id == "max"{
        set_size 200;
        set_color_effect 80;
        set_ghost_effect 50;
    }
    if clone_id == "min" {
        set_size 200;
        set_color_effect -80;
        set_ghost_effect 50;
    }
}

onkey "b" {
    if debug {
        think clone_id, 0.5;
    }
}