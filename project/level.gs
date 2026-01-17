%include includes/solid.gs
%include includes/defines.gs

costumes 
"blank.png",
"gfx/bg/black.png",
"gfx/bg/*/*.png",
;

var SPRITE_NAME = "Level";
var chunk_name;

var clone_layer_id;
var clone_segment_id;





on "boot" {
    if true {
        delete_this_clone;
    }
    goto 0, 0;
    hurtbox = "blank";
    z_position = 128;
    clone_layer_id = BgLayerType.None;
    clone_segment_id = -1;
    map_info = MapInfo{};
    chunk_info = ChunkInfo{};

    map_info = MapInfo{
        map_name: "step3",
        map_left_edge: 0,
        map_top_edge:  0,
        map_right_edge: 8,
        map_bottom_edge: 6};



}

onclone {
    clone_id = clone_segment_id & "_" & clone_layer_id;
    segment_zoomed_out_display;

}

proc segment_zoomed_out_display {
    # receive the chunk info and arrange into a grid depending on what clone this is.

    if clone_layer_id == BgLayerType.None {
        if true{
            delete_this_clone;
        }
        hurtbox = "blank";
    }

    if clone_segment_id < 1 or clone_segment_id > 9 {
        if true {
            delete_this_clone;
        }
        stop_this_script;
    }

    chunk_name = map_info.map_name;

    local chunk_x = map_info.map_left_edge + chunk_info.chunk_x;
    local chunk_y = map_info.map_top_edge + chunk_info.chunk_y;

    chunk_x += (clone_segment_id % 3) - 1;
    chunk_y += floor((clone_segment_id - 1) / 3) - 1;

    local segment_x = chunk_info.viewport_x + chunk_width * chunk_x;
    local segment_y = chunk_info.viewport_y + chunk_height * chunk_y;

    if clone_layer_id == BgLayerType.Picture {
         chunk_name = chunk_name & "_" & BgLayerType.Picture;
    }
    if clone_layer_id == BgLayerType.Solid {
        chunk_name = chunk_name & "_" & BgLayerType.Solid;
    }
    if clone_layer_id == BgLayerType.Soft {
        chunk_name = chunk_name & "_" & BgLayerType.Soft;
    }

    chunk_name = chunk_name & "_" & chunk_x & "," & -chunk_y;

    if clone_layer_id == BgLayerType.Picture {
        hurtbox = "blank";
    }
    else {
        hurtbox = chunk_name;
    }

    switch_costume "blank";
    switch_costume hurtbox;
    x_position = segment_x;
    y_position = segment_y;

    # write the clone information to our Solids tracker.
    init_properties;
}

%define target_camera_height 64
%define target_camera_pan 24

proc set_camera_target {
    # if "player"."xvel.v1" == 0 or abs("player"."xvel.v1") >= 1.5 or abs("player"."x position") > 16 {
    #     camera_target_x = "player"."x_position" + 12 * sign_of("player"."direction");
    # }
    if not ("player"."xvel.dx" == 0) or ctrl_left > 0 or ctrl_right > 0 {
        camera_target_x += 2*"player"."xvel.dx";

        if abs("player"."x_position" - camera_target_x) > target_camera_pan {
            camera_target_x = "player"."x_position" + (target_camera_pan * sign_of(-"player"."x_position" + camera_target_x)); 
        }
    } 
    else {
        if not (sign_of(camera_target_x - "player"."x_position") == sign_of("player"."direction")){
            camera_target_x = "player"."x_position" + target_camera_pan * 0.5 * sign_of ("player"."direction"); 
        }  

    }


    # camera_target_y += 0.9 * "player"."yvel.dx";

    # camera_target_y = "player"."last_grounded_y" + 28;
    camera_y_min = "player"."y_position" - 20;
    if "player"."yvel.dx" < 0 {
        local lerp = 1 - ("player"."y_position" - "player"."last_grounded_y") / target_camera_height;
        lerp = clamp(lerp, min: 0, max: 2);
        # Have to round or else pafu's oscillating y velocity will trigger this.
        camera_y_max += round("player"."yvel.dx" / delta_time) * delta_time * lerp;

    }
    
    camera_y_max = min (camera_y_max, "player"."last_grounded_y" + target_camera_height);
    camera_y_max = min (camera_y_max, "player"."y_position" + target_camera_height);
    camera_y_max = max(camera_y_max, "player"."y_position");
    # camera_y_max = min(camera_y_max, "player"."y_position");
    camera_target_y = clamp(camera_target_y, camera_y_min, camera_y_max);
    # if "player"."grounded" {
    #     camera_target_y = "player"."last_grounded_y" + 20;
    # }
    # else {
            


            
    #     }

}
proc pan_to_target {
    # pan camera x/y to the scroll target.
    camera_x += camera_subpixel_x;
    camera_y += camera_subpixel_y;

    local xmax = ((map_info.map_right_edge - 1) - map_info.map_left_edge) * chunk_width;
    local ymin = (map_info.map_top_edge - (map_info.map_bottom_edge - 1)) * chunk_height;
    camera_target_x = clamp(camera_target_x, 0, xmax);
    camera_target_y = clamp(camera_target_y, ymin, 0);

    local sign = sign_of(camera_target_x > camera_x);

    local speed = ("player"."xvel.v1" * 1.5) * sign;
    if speed < 0.4 {
        speed = 0.4;
    }
    speed *= delta_time;
    if abs(camera_x - camera_target_x) < speed {
        camera_x = camera_target_x;
    }
    else {
        camera_x += speed * sign;
    }

    camera_speed_x = speed;


    # camera_y = camera_target_y;
    sign = sign_of(camera_target_y > camera_y);
    speed = ("player"."yvel.v1" * 1.3) * sign;
    if speed < 1.5 {
        speed = 1.5;
    }
    speed *= delta_time;

    if abs(camera_y - camera_target_y) < speed {
        camera_y = camera_target_y;
    }
    else {
        camera_y += speed * sign;
    }
    camera_speed_y = speed;

    camera_x = clamp(camera_x, 0, xmax);
    camera_y = clamp(camera_y, ymin, 0);

    camera_subpixel_x = camera_x % 1;
    camera_x = floor(camera_x);
    camera_subpixel_y = camera_y % 1;
    camera_y = floor(camera_y);
    
}

proc solve_segments {
    # solve for the properties of the centre segment (5) based on the current camera position.
    local viewport_x = 0;
    local grid_relative_camera_x = (camera_x) % chunk_width;
    local chunk_x = round(camera_x / chunk_width);
    # if grid_relative_camera_x >= (chunk_width * 0.5){
    #     # case 1: left half should be in camera
    #     chunk_x = floor(camera_x / chunk_width);
    # }
    # else {
    #     # case 2: right half should be in camera
    #     chunk_x = floor(camera_x / chunk_width) - 1;
    #     viewport_x -= chunk_width;
    # }

    local viewport_y = 0;
    local grid_relative_camera_y = (camera_y) % chunk_height;
    local chunk_y = round(camera_y / chunk_height);
    # if grid_relative_camera_y >= (chunk_height * 0.5){
    #     # case 1: bottom half should be in camera
    #     chunk_y = floor(camera_y / chunk_height) + 1;
    # }
    # else {
    #     # case 2: top half should be in camera
    #     chunk_y = floor(camera_y / chunk_height);
    #     viewport_y += chunk_height;
    # }

    viewport_x -= camera_x;
    viewport_y -= camera_y;

    chunk_info = ChunkInfo {
        viewport_x: round_256(viewport_x),
        viewport_y: round_256(viewport_y),
        chunk_x: round_256(chunk_x),
        chunk_y: round_256(chunk_y),
    };
}

proc load_map{
    if true {
        delete_this_clone;
    }
    # create 2x2 clone grid
    # _______
    # |1 | 2| 3
    # |--+--+--
    # |4 | 5| 6
    # ---+--+--
    # |7 | 8| 9
    # --------
    # try to centre 5 on the camera.

    clone_segment_id = 1;
    repeat 9 {
        clone_layer_id = BgLayerType.Picture;
        clone;
        clone_layer_id = BgLayerType.Solid;
        clone;
        clone_segment_id++;
    }
    clone_segment_id = 0;

    # assume camera has been set to the right position already.
    solve_segments;




    # clone_layer_id = BgLayerType.Soft;
    # clone;
    clone_layer_id = BgLayerType.None;
}
on "load_map_002" {# conjectural name
    load_map;
} 

on "tick_000"{
    if clone_layer_id == BgLayerType.None {
        stop_this_script;
    }

    if clone_layer_id == BgLayerType.Picture {
        hide;
    }
    else {
        show;
    }
}
on "tick_cosmetics"{
    if hitbox_view {
        
        stop_this_script;
    }

    if clone_layer_id == BgLayerType.Picture {
        
        switch_costume chunk_name;
        show;
    }
    else {
        hide;
    }
}



on "tick_302"{
    if clone_id != "root" {
        stop_this_script;
    } 
    set_camera_target;
    pan_to_target;
    solve_segments;

}

on "tick_303" {
    if clone_id == "root" {
        stop_this_script;
    }
    segment_zoomed_out_display;
}



on "set_debug_options"{
    if clone_id != "root"{
        stop_this_script;
    }
    

    # nine_segment_view;



}
nowarp proc nine_segment_view {
    G_game_state = "scroll_test";
    forever {
        solve_segments;
        broadcast "tick_303";
        broadcast "tick_display";

        set_pen_color "0xff4040";
        set_pen_size 2;

        if key_pressed("space"){
            camera_x += mouse_x() * sqrt(2) * 0.1;
            camera_y += mouse_y() * sqrt(2) * 0.1;

        }

        cam_preview_x = 0;
        cam_preview_y = 0;

        top = cam_preview_y + 90;
        right = cam_preview_x + 120;
        bottom = cam_preview_y - 90;
        left = cam_preview_x - 120;

        erase_all;
        goto cam_preview_x, cam_preview_y;
        pen_down;
        pen_up;
        
        goto left, top;
        pen_down;
        goto right, top;
        goto right, bottom;
        goto left, bottom;
        goto left, top;
        pen_up;
    }
}

nowarp proc nametable_view {
    G_game_state = "scroll_test";
    forever {
        broadcast "tick_302";
        broadcast "tick_303";
        broadcast "tick_display";

        set_pen_color "0xff4040";
        set_pen_size 2;

        if key_pressed("space"){
            camera_x += mouse_x() * sqrt(2) * 0.1;
            camera_y += mouse_y() * sqrt(2) * 0.1;

        }

        cam_preview_x = (camera_x - chunk_width * 0.5) % chunk_width;
        cam_preview_x -= chunk_width * 0.5 - 16;
        cam_preview_y = (camera_y - chunk_height * 0.5) % chunk_height;
        cam_preview_y -= chunk_height * 0.5 + 16;

        top = cam_preview_y + 90;
        right = cam_preview_x + 120;
        bottom = cam_preview_y - 90;
        left = cam_preview_x - 120;

        erase_all;
        goto cam_preview_x, cam_preview_y;
        pen_down;
        pen_up;
        
        goto left, top;
        pen_down;
        goto right, top;
        goto right, bottom;
        goto left, bottom;
        goto left, top;
        pen_up;
    }
}