%include includes/utils.gs
%include includes/obj.gs
%include includes/collisions.gs
%define soft_platform_snap 3;
# %define platform_snap 1;

var SPRITE_NAME = "Unnamed Actor";

# anything that has physics in the game world and collides with solids.
enum CollideAction {
    Nothing, # Actor will still be blocked from entering the solid, but attributes like xvel yvel will not be changed.
    Stop,      # Set xvel and yvel to 0.
    Squish,
    
}
# enum Direction {
#     None,
#     Up,
#     Right,
#     Down,
#     Left
# }
struct Collision {
    wall,
    collider,
}
var CollideAction_param = -1;

struct ContinuousVelocity {
    v0 = 0, # velocity at frame start (unused, and editing this should do nothing)
    v1 = 0, # velocity at frame end
    dx = 0, # integrated
    a  = 0, # acceleration (accumulate per frame)
}

var ContinuousVelocity xvel;

var ContinuousVelocity yvel;

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



func accelerate (vx, ax, accumulated_ax, max = "Infinity") ContinuousVelocity{
    local vx_2 = $vx + $ax;

    if vx_2 * sign_of($max) > abs($max) {
        vx_2 = $max;
    }
    return ContinuousVelocity{v0: $vx, v1: vx_2, dx: vx_2, a: $accumulated_ax + (vx_2 - $vx)};
}

# note about acceleration functions: seems to be a bad idea to use more than one per timestep due to delta time shenanigans
func accelerate_advanced (v, a, accumulated_a, max = "Infinity") ContinuousVelocity {

    
    local saturation_delta_time = delta_time; # initial value means we don't know when velocity will max out.
    local v1 = $v + $a * delta_time;

    if v1 * sign_of($max) > abs($max) {
        v1 = $max;
        saturation_delta_time = (v1 - $v) / $a; 
        # sat<0 -- saturation was reached in the past (slowly decelerate - TODO)
        # sat=0 -- saturation is happening now
        # 0<sat<delta_time -- saturation will occur during this frame
        # sat >= delta_time -- saturation will occur after this frame 
    }


    local t2 = saturation_delta_time;
    local dx = 0;

    if t2 <= 0 {
        dx = v1 * delta_time;
    }
    if t2 > 0 and t2 < delta_time {
        dx = (($v * t2 + (0.5 * $a * t2 * t2) + v1 * (delta_time - t2)));
    }
    else {
        dx = ($v + v1) * 0.5 * delta_time;
    }

    local effective_a = (v1 - $v) / delta_time;

    return ContinuousVelocity{v0: $v, v1: v1, dx: dx, a: $accumulated_a + effective_a};
}

func decelerate_advanced (v, a, accumulated_a, min = 0) ContinuousVelocity{
    # Return a velocity slowed down by some acceleration amount. 
    # The deceleration is always the same sign as the inputted vx.
    # Examples:
    # decelerate (1, -0.5) -> 0.5
    # decelerate (1, 0.5) -> 0.5
    # decelerate (-1, -2, min = -0.3) -> 0.3
    # decelerate (1, -2, min = 0) -> 0 
    local v_ = abs($v);
    local a_ = abs($a);
    local stop_delta_time = delta_time;


    local v1 = v_ - a_ * delta_time;

    if v1 < $min {
        v1 = $min;
        stop_delta_time = (v1 - $v) / a_;
    }

    local t2 = stop_delta_time;
    local dx = 0;

    if t2 <= 0{
        dx = v1 * sign_of($v) * delta_time;
    }

    if t2 > 0 and t2 < delta_time{
        dx = ((v_ * t2 + (0.5 * a_ * t2 * t2) + v1 * (delta_time - t2)) * sign_of($v));
    }
    else {
        dx = (v_ + v1) * 0.5 * sign_of($v) * delta_time;
    }

    local effective_a = (v1 - $v) / delta_time;

    return ContinuousVelocity{v0: $v, v1: v1 * sign_of($v), dx: dx, a: $accumulated_a + effective_a};
}

var ContinuousVelocity accelerate_saturation_vel;
var acceleration_saturation_return_case;
enum AccelerationSaturationCase {
    UnderBounds,
    BoundedAcceleration,
    BoundedDeceleration,
    OverBounds,
}

func accelerate_saturation (acc, v, a1, a2, d1, d2, s = "Infinity", z = 0) ContinuousVelocity {
    # Solve for accelerating and decelerating forces in the direction of some saturation point.
    # v: current velocity.
    # a1: acceleration between the zero point and saturation.
    # a2: acceleration before the zero point.
    # d1: deceleration between saturation and the zero point. (Input as negative to decelerate)
    # d2: deceleration when velocity exceeds saturation.
    # s:  velocity of saturation. The direction of this value relative to zero determines the sign of the others.
    # z:  the zero point. Or you can set it to be not zero, but who knows what might happen. 
    #          |   d1 <-    |    d2 <==
    # -  -- ---z------------s--- -- - > velocity
    # a2 ==>   |   a1 ->    |

    # First, convert all values to signed magnitude in the direction of saturation.
    local sign = sign_of($s - $z);
    local v = $v * sign;
    local a1 = $a1;
    local a2 = $a2;
    local d1 = $d1;
    local d2 = $d2;
    local s = $s * sign;
    local z = $z * sign;

    # case 1: velocity is below zero (accelerate with a2)

    if v < z {
        accelerate_saturation_vel = accelerate_advanced(v, a2, $acc, s);
        acceleration_saturation_return_case = AccelerationSaturationCase.UnderBounds;
    }
    else {
        # case 2: velocity is beyond saturation (decelerate with d2)
        if v > s {
            accelerate_saturation_vel = decelerate_advanced(v, -d2, $acc, z);
            acceleration_saturation_return_case = AccelerationSaturationCase.OverBounds;
        }
        else {
            # case 3: velocity is between zero and saturation (apply net acceleration between a1 and d1)
            if a1 + d1 >= 0 {
                accelerate_saturation_vel = accelerate_advanced(v, a1 + d1, $acc, s);
                acceleration_saturation_return_case = AccelerationSaturationCase.BoundedAcceleration;
            }
            else {
                accelerate_saturation_vel = decelerate_advanced(v, -a1 - d1, $acc, z);
                acceleration_saturation_return_case = AccelerationSaturationCase.BoundedDeceleration;
            }
        }
    }

    # Convert back to the sign of the input.
    return ContinuousVelocity {
        v0: $v,
        v1: accelerate_saturation_vel.v1 * sign,
        dx: accelerate_saturation_vel.dx * sign,
        a:  accelerate_saturation_vel.a * sign
    };

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

on "tick_000"{
    xvel.a = 0;
    yvel.a = 0;

    # necessary for the 1st frame of the game loop
    # x_scroll = -camera_x;
    # y_scroll = -camera_y;
}

# on "tick_108"{
#     actor_tick;
# }
on "tick_303" {

    x_scroll = -camera_x; 
    y_scroll = -camera_y;
}

