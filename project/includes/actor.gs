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

func accelerate (vx, ax, max = "Infinity"){
    local vx_2 = $vx + $ax;

    if abs(vx_2) > abs($max) {
        return abs($max) * sign_of(vx_2);
    }
    return vx_2;
}

func decelerate (vx, ax, min = 0){
    # Return a velocity slowed down by some acceleration amount. 
    # The deceleration is always the same sign as the inputted vx.
    # Examples:
    # decelerate (1, -0.5) -> 0.5
    # decelerate (1, 0.5) -> 0.5
    # decelerate (-1, -2, -0.3) -> 0.3

    local vx_2 = abs($vx);
    local ax_2 = abs($ax);

    vx_2 = $vx - $ax;

    if vx_2 < $min {
        return $min * sign_of($vx);
    }
    return vx_2 * sign_of($vx);
}


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


proc actor_tick{
    speedcaps;
    move_x x_vel;
    move_y y_vel;
}

on "tick_108"{
    actor_tick;
}
