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
%include gfx/ply/hal/costume-names.gs
%include includes/input-mapping.gs



costumes 
"gfx/ply/hitbox/stand.png" as "hbox_stand",
"gfx/ply/hitbox/crouch.png" as "hbox_crouch",
"gfx/ply/hal/*.png",
"gfx/ply/placeholder/*.png/"
;



var SPRITE_NAME = "Player";

var airborne = 0;

proc boot{
    switch_costume FR_STAND;
    last_hurtbox = "hbox_stand";
    x_position = -32;
    y_position = 180;
    airborne = 0;

}
proc player_tick{
    x_control;
    y_control;
    # actor_physics;

}

proc x_control{
    if ctrl_left > 0 {
        if xvel.v1 <= 0 {
            xvel = accelerate_advanced(xvel.v1, -accel_run, -max_run);
        }
        else {
            xvel = accelerate_advanced(xvel.v1, -decel_run, -max_run);
        }
    }
    else{
        if ctrl_right > 0 {
            if xvel.v1 >= 0 {
                xvel = accelerate_advanced(xvel.v1, accel_run, max_run);

            }
            else {
                xvel = accelerate_advanced(xvel.v1, decel_run, max_run);
            }
        }
        else{
            xvel = decelerate_advanced(xvel.v1, decel_still);
        }
    }
    
}

proc y_control{
    # dirty grounded check... don't tell anyone about this...
    last_y = y_position;
    change_y -1;
    local grounded = is_colliding();
    set_y last_y;


    # make sure velocity changes come before gravity/accelerating forces.
    if grounded {
        if ctrl_a > 0 and ctrl_a <= ceil(2 / delta_time) {
            yvel.v1 = jump_vel + (jump_incr) * abs(xvel.dx) ;
        }
    }

    local gravity = fall_gravity;
    if ctrl_a > 0{
        gravity = jump_gravity;
    }
    yvel = accelerate_advanced(yvel.v1, -gravity, -max_fall);

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

#idea: pack tile info into "touching colour" block