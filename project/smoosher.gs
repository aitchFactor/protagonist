%include includes/solid.gs
%include includes/defines.gs
%include includes/accel.gs
costumes "blank.png", "gfx/bg/step3/smoosher_*.png";

var Timer smoosh_timer;

on "boot" {
    
    boot;
}

on "tick_animation" {
    switch_costume "smoosher_gfx";
}

on "tick_303" {

    x_scroll = -camera_x; 
    y_scroll = -camera_y;
}

%define smoosh_start_y -560 + 160
proc boot {
    hurtbox = "smoosher_solid";
    y_position = smoosh_start_y;
    active = false;
    z_position = 130;
    x_position = 1344 - 64;
    y_position = smoosh_start_y;
    camera_x_min = "";
    camera_x_max = "";
}

proc go {
    boot;
    active = true;
    smoosh_timer.current = 240;
    respawn_mode = RespawnMode.Big;
    camera_mode = CameraMode.FreeTarget;
    camera_target_x = x_position;
    camera_target_y = smoosh_start_y - 200;

    camera_x_min = x_position - 128 + visible_width * 0.5;
    camera_x_max = x_position + 128 - visible_width * 0.5;

    if "soundfx"."music" != "switch" {
        broadcast "mus_switch";
    }
    

}
var overlapping;
proc tick {
    if not active {
        if "player"."y_position" < -500 and "player"."y_position" >= -664 and "player"."x_position" >= 1236 {
            go;
        }
        else {
            stop_this_script;
        }
    }
    smoosh_timer = decrement_timer(smoosh_timer);

    if timer_boundary_crossed (smoosh_timer) or y_position - "player"."y_position" > 104 + visible_height {
        camera_mode = CameraMode.Player;
    }

    # smoosher "physics"
    local up = 0;
    # puffs can buy the player time (todo: make more efficient)
    if touching ("puff") {
        if overlapping == false {
            yvel.v1 += 1.2;
        }
        overlapping = true;
    }
    else {
        overlapping = false;
    }

    yvel = accelerate_saturation(yvel.a, yvel.v1, 0.1, 0.2, 0, 0, -0.1, 0);

    y_position += yvel.dx;

    # chase the player if they scroll too fast
    if smoosh_timer.current <= 0 {
        y_position = clamp (y_position, max: camera_y + 144 + visible_height * 0.5);

    }




    if "player"."x_position" >= 1328 and "player"."y_position" <= -1044 {
        active = false;
        camera_x_max = "";
        # respawn_mode = RespawnMode.Small;
    }

    hurtbox = "smoosher_solid";
    switch_costume hurtbox;

    # y_position = clamp(y_position, ((visible_height * 0.5) - chunk_height * 0.5) + (- (map_info.map_bottom_edge - 1)) * chunk_height, smoosh_start_y);
}


on "tick_002" {
    tick;
}


on "player_respawn_big" {
    boot;
}

on "level_fadeout" {
    boot;
}

# onkey "1" {
#     go;
# }