%include includes/utils.gs
%include includes/obj.gs

var SPRITE_NAME = "Unnamed Actor";

# anything that has physics in the game world and collides with solids.
enum CollideAction {
    Nothing,
    Stop,
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
    dx = 0  # integrated
}

var ContinuousVelocity xvel;

var ContinuousVelocity yvel;

var last_collision_x;
var last_collision_y;

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
    xvel.v0 = 0;
    xvel.v1 = 0;
    xvel.dx = 0;

    yvel.v0 = 0;
    yvel.v1 = 0;
    yvel.dx = 0;

    last_collision_x = 0;
    last_collision_y = 0;

    # x_vel = 0;
    # y_vel = 0;
    x_remainder = 0;
    y_remainder = 0;
    speedcap_x = "Infinity";
    speedcap_y = "Infinity";
}


func get_colliding() Solid{
    # return the struct entry of the first colliding solid.
    local i = 0;
    repeat length Solids {
        i++;
        if touching(Solids[i].raw_name){
            return Solids[i];
        }
    }
    return Solid{};
}
func is_colliding(){
    Solid result = get_colliding();

    if result.raw_name != ""{
        return true;
    }
    return false;
}

func accelerate (vx, ax, max = "Infinity") ContinuousVelocity{
    local vx_2 = $vx + $ax;

    if vx_2 * sign_of($max) > abs($max) {
        vx_2 = $max;
    }
    return ContinuousVelocity{v0: $vx, v1: vx_2, dx: vx_2};
}

func accelerate_advanced (v, a, max = "Infinity") ContinuousVelocity {
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

    return ContinuousVelocity{v0: $v, v1: v1, dx: dx};
}

func decelerate_advanced (v, a, min = 0) ContinuousVelocity{
    # Return a velocity slowed down by some acceleration amount. 
    # The deceleration is always the same sign as the inputted vx.
    # Examples:
    # decelerate (1, -0.5) -> 0.5
    # decelerate (1, 0.5) -> 0.5
    # decelerate (-1, -2, -0.3) -> 0.3
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

    return ContinuousVelocity{v0: $v, v1: v1 * sign_of($v), dx: dx};
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
            xvel.v1 = 0;
            xvel.dx = xvel.v1 - xvel.v0;
            x_remainder = 0;
            last_collision_x = $sign;
            }
        }
        if $axis == Axes.y {
            yvel.v1 = 0;
            yvel.dx = yvel.v1 - yvel.v0;
            y_remainder = 0;
            last_collision_y = $sign;
        }
    }




proc move_x dx = 0, on_collide_action = CollideAction.Stop{
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

        if is_colliding(){
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
    sign = sign_of(dy_rounded);

    repeat (abs(dy_rounded)){
        local last_y = y_position();
        change_y sign;

        if is_colliding(){
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

    last_collision_x = 0;
    last_collision_y = 0;

    xvel.v1 = round_16(xvel.v1);
    yvel.v1 = round_16(yvel.v1);
    xvel.dx = round_16(xvel.dx);
    yvel.dx = round_16(yvel.dx);

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

on "tick_108"{
    actor_tick;
}
