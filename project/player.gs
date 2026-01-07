# note: don't include comments in the same line as a macro
#20/16
%define max_walk    1.25 
#384/65536
%define accel_walk  0.09375
#-256/65536
%define decel_still 0.0625  
#-640/65536
%define decel_walk  0.15625

%define fall_gravity 6/16

%define jump_gravity 3/16

%define max_fall 4

%define jump_vel 5

%include includes/actor.gs
%include gfx/ply/hal/costume-names.gs
%include includes/input-mapping.gs



costumes 
"gfx/ply/hitbox/stand.png" as "hbox_stand",
"gfx/ply/hitbox/crouch.png" as "hbox_crouch",
"gfx/ply/hal/*.png",
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
            xvel = accelerate_advanced(xvel.v1, -accel_walk, -max_walk);
        }
        else {
            xvel = accelerate_advanced(xvel.v1, -decel_walk, -max_walk);
        }
    }
    else{
        if ctrl_right > 0 {
            if xvel.v1 >= 0 {
                xvel = accelerate_advanced(xvel.v1, accel_walk, max_walk);

            }
            else {
                xvel = accelerate_advanced(xvel.v1, decel_walk, max_walk);
            }
        }
        else{
            xvel = decelerate_advanced(xvel.v1, decel_still);
        }
    }
    
}

proc y_control{
    # dirty grounded check... don't tell anyone about this...



    # make sure velocity changes come before gravity/accelerating forces.
    if ctrl_a == 1 {
        yvel.v0 = jump_vel;
        yvel.v1 = jump_vel;
    }


    yvel = accelerate_advanced(yvel.v1, -fall_gravity, -max_fall);

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