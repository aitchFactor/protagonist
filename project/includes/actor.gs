%include includes/utils.gs
%include includes/sprite.gs

# anything that has physics in the game world and collides with solids.
enum CollideAction {
    Nothing,
    Stop,
    Squish,
    
}

struct Collision {
    wall,
    collider,
}
var CollideAction_param = -1;

# struct ContinuousVelocity {
#     a = 0,
#     v0 = 0,
#     v1 = 0,
#     fac = 0
# }

# var ContinuousVelocity xvel;

# var ContinuousVelocity yvel;

var x_vel;
var y_vel;

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
    # xvel.a = 0;
    # xvel.v0 = 0;
    # xvel.v1 = 0;
    # xvel.fac = 0;
    # yvel.a = 0;
    # yvel.v0 = 0;
    # yvel.v1 = 0;
    # yvel.fac = 0;
    x_vel = 0;
    y_vel = 0;
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
        if touching(Solids[i].name){
            return Solids[i];
        }
    }
    return Solid{};
}
func is_colliding(){
    Solid result = get_colliding();

    if result.name != ""{
        return true;
    }
    return false;
}

# func accelerate (vx, ax, max = "Infinity"){
#     local vx_2 = $vx + $ax;

#     if abs(vx_2) > abs($max) {
#         return abs($max) * sign_of(vx_2);
#     }
#     return vx_2;
# }

func accelerate_advanced (v, a, max = "Infinity") {
    local saturation_delta_time = delta_time; # initial value means we don't know when velocity will max out.
    local v1 = $v + $a;

    if abs (v1) > abs($max) {
        v1 = abs($max) * sign_of($a);
    }

    if abs(v1) == abs($max){
        saturation_delta_time = (v1 - $v) / $a; 

        # sat<0 -- saturation was reached in the past (slowly decelerate - TODO)
        # sat=0 -- saturation is happening now
        # 0<sat<delta_time -- saturation will occur during this frame
        # sat >= delta_time -- saturation will occur after this frame 
    }

    local t2 = saturation_delta_time;

    if t2 <= 0 {
        return v1;
    }
    if t2 > 0 and t2 < delta_time {
        return (($v * t2 + (0.5 * $a * t2 * t2) + v1 * (delta_time - t2))) / delta_time;
    }
    else {
        return ($v + v1) * 0.5;
    }
}

func decelerate_advanced (v, a, min = 0){
    # Return a velocity slowed down by some acceleration amount. 
    # The deceleration is always the same sign as the inputted vx.
    # Examples:
    # decelerate (1, -0.5) -> 0.5
    # decelerate (1, 0.5) -> 0.5
    # decelerate (-1, -2, -0.3) -> 0.3
    local v_ = abs($v);
    local a_ = abs($a);
    local stop_delta_time = delta_time;


    local v1 = v_ - a_;

    if v1 < $min {
        v1 = $min;
        stop_delta_time = (v1 - $v) / a_;
    }

    local t2 = stop_delta_time;

    if t2 <= 0{
        return v1 * sign_of($v);
    }

    if t2 > 0 and t2 < delta_time{
        return ((v_ * t2 + (0.5 * a_ * t2 * t2) + v1 * (delta_time - t2)) * sign_of($v)) / delta_time;
    }
    else {
        return (v_ + v1) * 0.5 * sign_of($v);
    }
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



proc on_collide axis, collide_action{
    if $collide_action == CollideAction.Nothing{
        stop_this_script;
    }
    if $collide_action == CollideAction.Stop{
        if $axis == Axes.x {
            x_vel = 0;
            x_remainder = 0;
        }
        if $axis == Axes.y {
            y_vel = 0;
            y_remainder = 0;
        }
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
        local last_x = x_position;
        change_x sign;

        if is_colliding(){
            set_x last_x;
            on_collide  Axes.x,  $on_collide_action;
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
        local last_y = y_position;
        change_y sign;

        if is_colliding(){
            set_y last_y;
            on_collide  Axes.y,  $on_collide_action;
            if $on_collide_action != CollideAction.Nothing{
                stop_this_script;
            }
        }
        
    }

}


proc speedcaps{
    # cap and round velocity.
    x_vel = round_16(x_vel);
    y_vel = round_16(y_vel);

    if abs(x_vel) > speedcap_x{
        x_vel = speedcap_x * sign_of(x_vel);
    }
    if abs(y_vel) > speedcap_y{
        y_vel = speedcap_y * sign_of(y_vel);
    }
}


# func is_riding (solid){
    
# }

# proc squish{}
proc actor_physics{
    speedcaps;
    
    move_x x_vel * delta_time;
    move_y y_vel * delta_time;
}

proc actor_tick{
    actor_physics;
}

# Note: remember to call the actor tick in an instantiated actor.

# on "tick_101"{
#     actor_tick;
# }
