%include gfx/bg/step3/checkpoints.gs
%include includes/collisions.gs
%include includes/defines.gs
%include includes/utils.gs
costumes "blank.png", "gfx/debug/reticle.png", "gfx/24x24.png", "gfx/8x24.png";

var clone_id;
var Checkpoint checkpoint_unpacked;


proc level_loader {
    if map_info.map_name == "step3" {
        step3_checkpoints;
        repeat length (checkpoints) {
            clone_id ++;
            clone;
        }
        clone_id = 0;
    } 
}

func unpack_checkpoint (Checkpoint x) Checkpoint {
    # transform the raw coordinates of a checkpoint to the game's coordinates.
    return Checkpoint {
        chunk_x: $x.chunk_x,
        chunk_y: -$x.chunk_y,
        spawn_x: $x.spawn_x - chunk_width * 0.5,
        spawn_y: -$x.spawn_y + chunk_height * 0.5,
    };

}

on "boot" {
    if true {
        delete_this_clone;
    }
    clone_id = 0;
    checkpoint_unpacked = Checkpoint{};
    hide;
}

on "load_map" {
    if clone_id == 0{
        level_loader;
    }
}
onclone {
    hide;
}
proc small_checkpoint {
    local try_x = quantise("player"."last_grounded_x", 32, 0) + 16;
    local try_y = quantise("player"."last_grounded_y", 16, 1);

    # check this point is not inside a wall.
    clear_graphic_effects;
    switch_costume "24x24";
    set_size 100;
    goto try_x - camera_x, try_y - camera_y;

    if is_colliding_solid("", 0){
        stop_this_script;
    }

    # check there is a floor under the spawn point.
    switch_costume "8x24";
    change_y -5;
    change_x 12;
    if not is_colliding_solid("y", -1){
        stop_this_script;
    }
    change_x -24;
    if not is_colliding_solid("y", -1){
        stop_this_script;
    }

    
    # set a checkpoint to a safe spawn area.
    checkpoint_unpacked.spawn_x = try_x;
    checkpoint_unpacked.spawn_y = try_y;

}

proc big_checkpoint {
    # set the player's checkpoint to the one on this screen, if there is one.
    checkpoint_unpacked = unpack_checkpoint(checkpoints[clone_id]);

    if chunk_info.chunk_x == checkpoint_unpacked.chunk_x and chunk_info.chunk_y == checkpoint_unpacked.chunk_y {
        current_checkpoint_index = clone_id;
    }
}

on "tick_303" {
    if G_game_state != "play" {
        stop_this_script;
    }
    if clone_id == 0 {
        small_checkpoint;
    }
    if clone_id > 0 {
        big_checkpoint;
    }


}

on "tick_debug_last" {
    if not debug_show_checkpoints {
        hide;
        stop_this_script;
    }

    # if clone_id == 0 {
    #     stop_this_script;
    # }

    show;
    goto_front;
    if clone_id == 0 {
        switch_costume "24x24";
    }
    if clone_id > 0 {
        switch_costume "reticle";
        checkpoint_unpacked = unpack_checkpoint(checkpoints[clone_id]);
    }
    debug_x = checkpoint_unpacked.spawn_x - camera_x;
    debug_y = checkpoint_unpacked.spawn_y - camera_y;

    if not hitbox_view {
        debug_x *= 2;
        debug_y *= 2;
    }

    set_size 800;
    goto debug_x, debug_y;
    set_size 100 + 100 * (not hitbox_view);

    if current_checkpoint_index == clone_id {
        set_color_effect 100;
        think clone_id;
    }
    else {
        set_color_effect -10;
        think "";
    }

    if clone_id == 0 {
        clear_graphic_effects;
    }

    
    
}

