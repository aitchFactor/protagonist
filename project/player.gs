# note: don't include comments in the same line as a macro
#20/16
%define max_walk    1.25 
#384/65536
%define accel_walk  0.09375
#-256/65536
%define decel_still 0.0625  
#-640/65536
%define decel_walk  0.15625

%include includes/actor.gs
%include gfx/ply/hal/costume-names.gs
%include includes/input-mapping.gs



costumes 
"gfx/ply/hitbox/stand.png" as "hbox_stand",
"gfx/ply/hitbox/crouch.png" as "hbox_crouch",
"gfx/ply/hal/*.png",
;



var SPRITE_NAME = "Player";

proc boot{
    switch_costume FR_STAND;
    last_hurtbox = "hbox_stand";
    x_position = -32;

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