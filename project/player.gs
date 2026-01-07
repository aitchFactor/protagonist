# note: don't include comments in the same line as a macro
#20/16
%define max_walk    1.25 

%define max_run    36/16
#384/65536
%define accel_walk  1.5/16
%define accel_run  1.5/16
#-256/65536
%define decel_still 0.0625  
#-640/65536
%define decel_walk  2.5/16

%define decel_run  5/16

%define fall_gravity 6/16

%define jump_gravity 3/16

%define max_fall 4

%define jump_vel sqrt(24)

%define jump_incr  (2.5/16)

%include includes/actor.gs
%include gfx/ply/hal/animation-data.gs
%include includes/input-mapping.gs



costumes 
"gfx/ply/hitbox/stand.png" as "hbox_stand",
"gfx/ply/hitbox/crouch.png" as "hbox_crouch",
"gfx/ply/hal/*.png",
"gfx/ply/placeholder/*.png/"
;



var SPRITE_NAME = "Player";

var airborne = 0;
var skid = 0;

proc boot{
    switch_costume FR_STAND;
    last_hurtbox = "hbox_stand";
    x_position = -32;
    y_position = 180;
    airborne = 0;
    skid = 0;
    walk_counter = 0;
    grounded = 0;
    set_rotation_style_left_right;
    state_machine("play");

}
proc player_tick{
    x_control;
    y_control;
    # actor_physics;

}

proc state_machine new_state = "boot"{
    # Change the player state, necessary for any time when gameplay is different (ie, can't jump in air).
    # States can be changed during the control or cosmetic phases, or by cutscenes.
    # In this function, you can change which states are allowed to transition to which.
    # If the state changes, the animation for that state will be played.

    if state == $new_state {
        stop_this_script;
    }
    if state == "boot" {
        state = $new_state;
        animation_counter = 0;
        stop_this_script;
    }
    
    # ground -> skid and vice versa
    if "ground" in state or "skid" in state {
        ## no restrictions yet
    }

    # air ignores skid
    if "air" in state {
        if "skid" in $new_state {
            stop_this_script;
        }
    }


    # animation_counter = 0;
    state = $new_state;


    local anim_name = state_animation (state);
}




proc x_control{

    hal_x_control;


    
}
proc hal_x_control {
    # if "ground" in state{
    #     state_machine ("play.ground");
    # }


    if ctrl_left > 0 {
        if xvel.v1 <= 0 {
            xvel = accelerate_advanced(xvel.v1, -accel_run, -max_run);
            state_machine ("play.ground.walk.L");
        }
        else {
            xvel = accelerate_advanced(xvel.v1, -decel_run, -max_run);

            state_machine ("play.ground.skid.L");
        }
    }
    else{
        if ctrl_right > 0 {
            if xvel.v1 >= 0 {
                xvel = accelerate_advanced(xvel.v1, accel_run, max_run);
                state_machine ("play.ground.walk.R");

            }
            else {
                xvel = accelerate_advanced(xvel.v1, decel_run, max_run);
                state_machine ("play.ground.skid.R");
            }
        }
        else{
            xvel = decelerate_advanced(xvel.v1, decel_still);
            state_machine ("play.ground.idle");
        }
    }
}
var grounded; 
proc y_control{
    # dirty grounded check... don't tell anyone about this...
    last_y = y_position;
    change_y -1;
    grounded = is_colliding();
    set_y last_y;
    
    if grounded and not ("ground" in state) {
        state_machine ("play.ground");
    }
    if not grounded and not ("air" in state) {
        state_machine ("play.air");
    }

    hal_y_control;

}

proc hal_y_control {
    # Halli's physics, which he gained by eating some kind of hollow pebble that had paper sticking to it.
    # make sure velocity changes come before gravity/accelerating forces.
    if grounded {
        if ctrl_a > 0 and ctrl_a <= ceil(2 / delta_time) {
            yvel.v1 = jump_vel + 2 * (jump_incr) * abs(xvel.dx / delta_time) ;
            state_machine ("play.air.up");
            grounded = false;
        }
        

    }

    local gravity = fall_gravity;
    if ctrl_a > 0{
        gravity = jump_gravity;
    }
    yvel = accelerate_advanced(yvel.v1, -gravity, -max_fall);
}



var walk_counter;
var blink_time;

proc ground_animation{
    if state == "play.ground.idle"{
        if animation_counter > 47 and animation_counter % 48 < delta_time{
            if random(0, 1) == 0{
                force_animation_refresh;
            }
        }
    }



    if "walk" in state {
        animation_counter += abs(xvel.dx); # dx is scaled by delta_time already.
        point_in_direction (90 * sign_of(xvel.dx));
        stop_this_script; # avoid animation counting.
    }


    animation_counter += delta_time;
}

proc air_animation{
    # something like a ceiling bonk animation might need some more thinking.
    if yvel.v1 > 0 {
        state_machine ("play.air.up");

    }
    else {
        state_machine ("play.air.down");
    }


    if ctrl_right > 0 {

        point_in_direction (90);
    }
    if ctrl_left > 0 {
        point_in_direction (-90);
    }

    animation_counter += delta_time;
}

proc animation_timing{
    # If any animations have their animation tied to something, it's controlled here. 
    # But because I haven't completely figured this system out yet, this proc also has some state changes. 



    if "ground" in state or "skid" in state{
        ground_animation;
        stop_this_script;
    }
    if "air" in state{
        air_animation;
        stop_this_script;
    }

}

onflag{
    sort_depth false, false;
}

on "boot"{
    boot;
}

on "tick_101"{
    player_tick;
}

on "tick_cosmetics"{
    animation_timing;
}
#idea: pack tile info into "touching colour" block