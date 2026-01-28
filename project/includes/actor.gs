%include includes/utils.gs
%include includes/obj.gs
%include includes/collisions.gs
%include includes/accel.gs
%define soft_platform_snap 3;
# %define platform_snap 1;

var SPRITE_NAME = "Unnamed Actor";

# anything that has physics in the game world and collides with solids.
enum CollideAction {
    Nothing, # Actor will still be blocked from entering the solid, but attributes like xvel yvel will not be changed.
    Stop,      # Set xvel and yvel to 0.
    Squish,
    
}

struct Collision {
    wall,
    collider,
}
var CollideAction_param = -1;



var collision_x;
var collision_y;

var inside_soft;



# var x_vel;
# var y_vel;

var x_remainder;
var y_remainder;
var speedcap_x;
var speedcap_y;

on "boot" {
    actor_boot;
}

proc actor_boot {
    # sprite boot exists as a different script as well.
    CollideAction_param = -1;
    xvel = ContinuousVelocity{};
    yvel = ContinuousVelocity{};

    collision_x = 0;
    collision_y = 0;
    inside_soft = false;

    # x_vel = 0;
    # y_vel = 0;
    x_remainder = 0;
    y_remainder = 0;
    speedcap_x = "Infinity";
    speedcap_y = "Infinity";
}




# func decelerate (vx, ax, min = 0){
#     # Return a velocity slowed down by some acceleration amount. 
#     # The deceleration is always the same sign as the inputted vx.
#     # Examples:
#     # decelerate (1, -0.5) -> 0.5
#     # decelerate (1, 0.5) -> 0.5
#     # decelerate (-1, -2, -0.3) -> 0.3

#     local vx_2 = abs($vx);
#     local ax_2 = abs($ax);

#     vx_2 = vx_2 - ax_2;

#     if vx_2 < $min {
#         return $min * sign_of($vx);
#     }
#     return vx_2 * sign_of($vx);
# }



proc on_collide sign, axis, collide_action{
    if $collide_action == CollideAction.Nothing{
        stop_this_script;
    }
    if $collide_action == CollideAction.Stop{
        if $axis == Axes.x {
            xvel.a -= xvel.v1;
            xvel.v1 = 0;
            xvel.dx = 0;
            x_remainder = 0;
            collision_x
         = $sign;
            }
        }
        if $axis == Axes.y {
            yvel.a -= yvel.v1;
            yvel.v1 = 0;
            yvel.dx = 0;
            y_remainder = 0;
            collision_y = $sign;
        }
    }


proc check_soft {
    # Ignore a collision if the collision type is with a soft platform.
    # We do so by switching the hitbox to its soft variant and checking the collision direction. 
    local type = get_colliding_type();
}


proc move_x dx = 0, on_collide_action = CollideAction.Stop{
    local rounded_x = round(x_position());
    x_remainder += $dx;
    local dx_rounded = round(x_remainder);
    if dx_rounded == 0 {
        stop_this_script;
    }
    # note: x_remainder could be negative. does this mean anything?
    x_remainder -= dx_rounded;
    sign = sign_of(dx_rounded);

    repeat (abs(dx_rounded)){
        local last_x = x_position();
        change_x sign;

        if is_colliding_solid("x", sign){
            # needs rework.
            set_x last_x;
            on_collide  sign, Axes.x,  $on_collide_action;
            if $on_collide_action != CollideAction.Nothing{
                stop_this_script;
            }
        }

    }


}

proc move_y dy = 0, on_collide_action = CollideAction.Stop{
    y_remainder += $dy;
    local dy_rounded = round(y_remainder);
    if dy_rounded == 0 {
        stop_this_script;
    }
    y_remainder -= dy_rounded;
    local sign = sign_of(dy_rounded);

    # Soft platform snapping
    # recursion kinda risky but should work
    if sign == -1 {
        local before_snap_check = y_position();
        local before_dy_rounded = dy_rounded;
        local BoundingBox last_bb = bounding_box;
        ##############
        # snap to a platform by moving upwards and adding the distance to the downwards movement here.
        # to preserve the collision invariant, recurse into another safe move_y procedure.



        if inside_soft {
            move_y soft_platform_snap;
        }
        # else {
        #     move_y platform_snap;
        # }
        ################
        bounding_box = last_bb;
        dy_rounded = before_dy_rounded + (before_snap_check - y_position());
        sign = -1;
        
    }

    repeat (abs(dy_rounded)){
        local last_y = y_position();
        change_y sign;

        if is_colliding_solid("y", sign){
            set_y last_y;
            on_collide sign, Axes.y,  $on_collide_action;
            if $on_collide_action != CollideAction.Nothing{
                stop_this_script;
            }
        }
        
    }

}


proc speedcaps{
    # cap and round velocity.

    collision_x = 0;
    collision_y = 0;

    xvel.v1 = round_256(xvel.v1);
    yvel.v1 = round_256(yvel.v1);
    xvel.dx = round_256(xvel.dx);
    yvel.dx = round_256(yvel.dx);

    if abs(xvel.v1) > speedcap_x{
        xvel.v1 = speedcap_x * sign_of(xvel.v1);
    }
    if abs(yvel.v1) > speedcap_y{
        yvel.v1 = speedcap_y * sign_of(yvel.v1);
    }
    if abs(xvel.dx) > speedcap_x{
        xvel.dx = speedcap_x * sign_of(xvel.dx);
    }
    if abs(yvel.dx) > speedcap_y{
        yvel.dx = speedcap_y * sign_of(yvel.dx);
    }
}


# func is_riding (solid){
    
# }

# proc squish{}
proc actor_physics{
    speedcaps;
    
    move_x xvel.dx;
    move_y yvel.dx;
}

proc actor_tick{
    actor_physics;
}

# Note: remember to call the actor tick in an instantiated actor.
on "tick_301" {
    # Remove scroll offset before scrolling occurs.
    x_position = round_256(x_position() - x_scroll); 
    y_position = round_256(y_position() - y_scroll);
}

on "tick_000"{
    xvel.a = 0;
    yvel.a = 0;
    set_ghost_effect 100;
}

on "tick_display" {
    set_ghost_effect 0;
}

# on "tick_108"{
#     actor_tick;
# }
on "tick_303" {

    x_scroll = -camera_x; 
    y_scroll = -camera_y;
}

