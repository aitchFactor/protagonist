%include gfx/bg/step3/data.gs
%include includes/collisions.gs
%include includes/defines.gs
%include includes/utils.gs
costumes "blank.png", "gfx/debug/reticle.png", "gfx/24x24.png", "gfx/8x24.png";

var SPRITE_NAME = "Checkpoint";
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
    
    # set checkpoint to spawn point
    checkpoint_unpacked = unpack_checkpoint(checkpoints[1]);

    # add to global checkpoint list (shouldn't be read by other clones)
    mini_checkpoint = checkpoint_unpacked;
}

on "boot" {
    if true {
        delete_this_clone;
    }
    clone_id = 0;
    checkpoint_unpacked = Checkpoint{};
    last_try_x = "Infinity";
    last_try_y = "Infinity";
    
    hide;
}

on "load_map_001" {
    if clone_id == 0{
        level_loader;
    }
}

onclone {
    hide;
}
proc small_checkpoint {
    show;
    set_rotation_style_do_not_rotate;
    local try_x = quantise("player"."last_grounded_x", 32, 0) + 16;
    local try_y = quantise("player"."last_grounded_y", 16, 1);

    # stop if we already have checked this point.
    if try_x == checkpoint_unpacked.spawn_x and try_y == checkpoint_unpacked.spawn_y {
        stop_this_script;
    }
    if try_x == last_try_x and try_y == last_try_y {
        stop_this_script;
    }

    last_try_x = try_x;
    last_try_y = try_y;

    # stop if we are offscreen.
    goto try_x - camera_x, try_y - camera_y;
    if not (x_position() == (try_x - camera_x) and y_position() == (try_y - camera_y)){
        stop_this_script;
    }

    # check this point is not inside a wall.
    clear_graphic_effects;
    bounding_box = BoundingBox {
        diameter_x: 32,
        diameter_y: 20,
        centre_x: 0,
        centre_y: 0
    };
    local collides = get_colliding_types();
    if bitmask(collides, BgLayerTypeBit.Solid) {
        stop_this_script;
    }
    if bitmask(collides, BgLayerTypeBit.Spike) {
        stop_this_script;
    }

    goto try_x - camera_x, try_y - camera_y;
    # check there is a floor under all parts of the spawn point.
    bounding_box = BoundingBox {
        diameter_x: 6,
        diameter_y: 0,
        centre_x: 0,
        centre_y: -20
    };

    bounding_box.centre_x = -10;
    if not is_colliding_solid("y", -1){
        stop_this_script;
    }
    bounding_box.centre_x = 0;
    if not is_colliding_solid("y", -1){
        stop_this_script;
    }
    bounding_box.centre_x = 10;
    if not is_colliding_solid("y", -1){
        stop_this_script;
    }

    
    # set a checkpoint to a safe spawn area.
    checkpoint_unpacked.spawn_x = try_x;
    checkpoint_unpacked.spawn_y = try_y;

    # update the global variable.
    mini_checkpoint = checkpoint_unpacked;

    hide;
}

proc big_checkpoint {
    # set the player's checkpoint to the one on this screen, if there is one.
    checkpoint_unpacked = unpack_checkpoint(checkpoints[clone_id]);

    if chunk_info.chunk_x == checkpoint_unpacked.chunk_x and chunk_info.chunk_y == checkpoint_unpacked.chunk_y {
        current_checkpoint_index = clone_id;
    }
}

on "tick_000" {
    hide;
    goto_back;
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

