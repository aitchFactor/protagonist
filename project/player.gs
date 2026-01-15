%include includes/actor.gs
%include includes/input-mapping.gs
%include includes/defines.gs

# note: don't include comments in the same line as a macro
#20/16
%define max_walk    317/256

%define max_run    573/256
#384/65536
%define accel_walk  1.5/16
%define accel_run  1.5/16
%define paf_accel_walk  0;
#-256/65536
%define decel_still 0.0625  
#-640/65536
%define decel_walk  2.5/16

%define decel_run  5/16

%define fall_gravity 6/16

%define jump_gravity 3/16

%define max_fall 4

%define jump_vel 5

%define jump_vel_smal sqrt(12)

%define jump_incr  (2/16)

%define spin_jump_vel (74/16)

# pafu's parameters

%define paf_gravity (8/49)

# same height as halli's standing jump height.
%define paf_jump_vel (100/21) 

# estimate
%define paf_jump_vel_smal (0.75)

# halfway between mario's walk and run speeds (not based on hollow knight)
%define paf_walk 1.875

# mario's p-speed 
%define paf_run 3.18

%define paf_decel paf_run/20
# blind guess
%define paf_max_fall 5

%define paf_skid_threshold 2

%define puff_cooldown 24

%include gfx/ply/hal/animation-data.gs
%include gfx/ply/paf/animation-data.gs


costumes 
"gfx/ply/hitbox/*.png/", 
"gfx/ply/hal/*.png",
"gfx/ply/placeholder/*.png/",
"gfx/ply/paf/*.png/",
;



var SPRITE_NAME = "Player";


# var airborne = 0;
# var skid = 0;

var jump_hold;
var jump_buffered;
var Timer direction_lock;
var Timer x_control_lock; # currently unused
var Timer y_control_lock; # currently unused
var Timer puff_timer;
var Timer coyote_timer;
var last_grounded_y;
var last_this_direction;


proc boot{
    switch_costume FR_STAND;
    x_position = -32;
    y_position = -32;
    z_position = 255;
    last_grounded_y = 0;
    this_direction = 90;
    last_this_direction = 90;
    walk_counter = 0;
    grounded = 0;
    jump_hold = 0;
    jump_buffered = 0;
    direction_lock = Timer{};
    x_control_lock = Timer{};
    y_control_lock = Timer{};
    puff_timer = Timer{};
    coyote_timer = Timer{};
    set_rotation_style_left_right;
    state_machine("play");

    if player == 1 {
        hurtbox = "stand";
    }
    if player == 2 {
        hurtbox = "stand-paf";
    }

}




proc state_machine new_state = "boot"{
    # Change the player state, necessary for any time when gameplay is different (ie, can't jump in air).
    # States can be changed during the control or cosmetic phases, or by cutscenes.
    # In this function, you can change which states are allowed to transition to which.
    # If the state changes, the animation for that state will be played.

    ### gates ###

    local new_state = $new_state;

    if state == new_state {
        stop_this_script;
    }
    if state == "boot" {
        state = new_state;
        animation_counter = 0;
        stop_this_script;
    }

    if "play" in new_state and "puff" in state and puff_timer.current > (puff_cooldown * 0.5) {
        stop_this_script;
    }

    if new_state == "play" {
        if grounded {
            new_state = "play.ground";
        }
        else {
            new_state = "play.air";
        }

    }
    if new_state == "play.puff"{

        if "ground" in state{
            new_state = ("play.ground.puff");
        }
        if "air" in state {
            new_state = ("play.air.puff");
        }
    }


    # Don't remove walk direction
    if new_state == "play.ground.walk" {
        if "play.ground.walk" in state {
            stop_this_script;
        }
    } 
    
    # air ignores skid
    if "air" in state {
        if "skid" in new_state {
            stop_this_script;
        }

        # Spinjump outprioritises normal animations
        if "spin" in state and "air" in new_state {
            stop_this_script;
        }
    }
    # ground -> skid and vice versa
    if new_state == "play.ground"{
        if xvel.v1 == 0 {
            new_state = "play.ground.idle";
            
        }
        else {
            if sign_of (xvel.v1) == sign_of(this_direction){
                if this_direction == 90{
                    new_state = "play.ground.walk.R";
                }
                else{
                    new_state = "play.ground.walk.L";
                }
            }
            else{
                new_state = "play.ground.skid";
            }
        }

    }



    # animation_counter = 0;
    if player == 1 {
        local anim_name = hal_state_animation (new_state, state);
    }
    if player == 2 {
        local anim_name = paf_state_animation (new_state, state);
    }
    state = new_state;



    ### effects ###
    if direction_lock.current <= 0 {
        state_to_direction;
    }
}

proc state_to_direction {
    if ".L" in state {
        this_direction = -90;
    }
    if ".R" in state {
        this_direction = 90;
    }
}

proc puff_control {
    if ctrl_b > 0 and ctrl_b <= (4/delta_time) and puff_timer.current <= 0 { # 4 frame buffer.
        
        state_machine("play.puff");
        if "puff" in state {
            puff_timer.current = puff_cooldown;
            direction_lock.current = puff_cooldown * 0.5;
            # halli: puff stalls momentum
            if player == 1 and yvel.v1 < 0 {
                yvel.v1 = 0;
            }

            add Projectile{
                type: "puff",
                name: "puff_halli_side_light",
                lifetime: round(puff_cooldown * 0.5),
                direction: this_direction,
                x_position: x_position + 16 * sign_of(this_direction),
                y_position: y_position,
                xvel: xvel.v1 + max_run * sign_of(this_direction),
                yvel: 0
            } to projectile_queue;


        }

    }

    if puff_timer.current <= (puff_cooldown * 0.5) and puff_timer.previous > (puff_cooldown * 0.5) {
        state_machine("play");
    }

}

proc x_control move = true{
    if player == 1 {
        hal_x_control $move;
    }

    if player == 2 {
        paf_x_control;
    }
    
}

# proc soft_speedcap velocity, speedcap, acceleration, deceleration AccDecMaxMin {
#     # if the current velocity is less than the speedcap, accelerate. Otherwise, decelerate. 
#     local speed = 4;
#     local speedcap = 3;
#     local acc = 0;
#     local deceleration = decel_still;
#     local acceleration = accel_walk;

#     if speed * sign_of(speed) > speedcap * sign_of (speed) {
#         return A
#         decelerate_advanced (speed, deceleration, acc, speedcap);
#     }
#     else {
#         accelerate_advanced (speed, acceleration, acc, speedcap * sign_of(speed));
#     }

# }

proc hal_x_control move = true {
    # hurtbox changes
    hurtbox = "stand";
    switch_costume hurtbox;

    # physics step
    local new_state = "";
    local a1 = 0;
    local a2 = 0;
    local d1 = 0;
    local d2 = 0;
    local s = 0;
    local z = 0;
    if ctrl_left > 0 or ctrl_right > 0 {
        a1 = accel_run;
        a2 = decel_run;
        # d1 = 0;
        d2 = -decel_still;
        s = max_run * bool_to_sign(ctrl_right > 0); # right => positive
        # z = 0;
        if "puff" in state {
            # limit puff speed to walking (similar to SMW2)
            # also nerfs puff as a stall option in midair.
            # todo: consider puff charge behaviour
            a1 = accel_walk;
            a2 = decel_walk;
        }
    }
    else {
        # a1 = 0;
        # a2 = 0;
        if grounded {
            d1 = -decel_still;
            d2 = -decel_still;
        }
        s = xvel.v1;
        # z = 0;
        
    }

    if "puff" in state {
        d2 = -decel_still;
        if ctrl_left > 0 or ctrl_right > 0 {
            s = max_walk * bool_to_sign(ctrl_right > 0);
        }
        else{
            s = max_walk * bool_to_sign(xvel.v1 > 0);
        }
    }
    xvel = accelerate_saturation (xvel.a, xvel.v1, a1, a2, d1, d2, s, z);


    if acceleration_saturation_return_case == AccelerationSaturationCase.UnderBounds{
        new_state = "play.ground.skid";
    }
    if acceleration_saturation_return_case == AccelerationSaturationCase.BoundedAcceleration{
        new_state = "play.ground.walk";
    }
    if acceleration_saturation_return_case == AccelerationSaturationCase.BoundedDeceleration{
        new_state = "play.ground.walk";
    }
    if acceleration_saturation_return_case == AccelerationSaturationCase.OverBounds{
        new_state = "play.ground.walk";
    }
    if xvel.v1 == 0 {
        new_state = "play.ground.idle";
    }


    if new_state != "" and "ground" in state {
        if ctrl_right > 0 {
            new_state = new_state & ".R";
        }
        if ctrl_left > 0 {
            new_state = new_state & ".L";
        }
        state_machine (new_state);
    }
}

proc paf_x_control {
    hurtbox = "stand-paf";
    switch_costume hurtbox;


    local acceleration = 0;
    local deceleration = 0;
    local speed_max = "Infinity";
    local speed_min = 0;

    local new_state = "";
    if ctrl_left > 0 {
        new_state = "play.ground.walk.L";

        if xvel.v1 > -paf_walk{
            speed_max = -paf_walk;

            if xvel.v1 > paf_skid_threshold { # braking from a sprint
                acceleration += -paf_decel;
                new_state = "play.ground.skid.L";
            }
            else {
                acceleration += -2 * paf_walk;
            }
            # xvel = accelerate_advanced(xvel.v1, -2 * paf_walk, xvel.a, -paf_walk);

        }
        else { # accelerating into a sprint
            speed_max = -paf_run;
            if "ground" in state {
                acceleration += -paf_accel_walk;
                # xvel = accelerate_advanced(xvel.v1, -paf_accel_walk, xvel.a, -paf_run);
            }
        }
    }
    else {
        if ctrl_right > 0 {
            new_state = "play.ground.walk.R";

            if xvel.v1 < paf_walk{
                speed_max = paf_walk;

                if xvel.v1 < -paf_skid_threshold { # braking from sprint
                    acceleration += paf_decel;
                    new_state = "play.ground.skid.R";
                }
                else {
                    acceleration += 2 * paf_walk;
                }
                # xvel = accelerate_advanced(xvel.v1, 2 * paf_walk, xvel.a, paf_walk);

            }
            else {
                speed_max = paf_run;
                if "ground" in state {
                    acceleration += paf_accel_walk;
                    # xvel = accelerate_advanced(xvel.v1, paf_accel_walk, xvel.a, paf_run);
                }
                else {
                    # xvel = accelerate_advanced(xvel.v1, 0, xvel.a, paf_run);
                }

            }
        }
        else{
            if abs(xvel.v1) > paf_walk{
                deceleration += paf_decel;
            }
            else{
                deceleration += paf_walk;
            }
            new_state = "play.ground.idle";
        }
    }

    if new_state != "" and "ground" in state {
        state_machine (new_state);
    }
    if abs(acceleration) - abs(deceleration) >= 0 {
        xvel = accelerate_advanced(xvel.v1, acceleration, xvel.a, speed_max);
    }
    else {
        xvel = decelerate_advanced(xvel.v1, deceleration, xvel.a, speed_min);
    }
}


var grounded; 
proc check_grounded {
    if yvel.v1 > 0 {
        # It's impossible, right? right...?
        stop_this_script;
    }

    last_y = y_position();
    change_y -1;
    grounded = is_colliding_solid("y", -1);
    set_y last_y;

    if grounded{
        last_grounded_y = y_position;
    }
}

proc y_control move = true{
    # dirty grounded check... don't tell anyone about this...
    # (pafu's gravity isn't high enough for a collision check from the previous frame to succeed)
    check_grounded;
    
    if grounded and not ("ground" in state) {
        state_machine ("play.ground");
    }
    if not grounded {
        if not ("air" in state){
            state_machine ("play.air");
            coyote_timer.current = 2;
        }
        
    }

    if player == 1 {
        hal_y_control $move;
    }
    if player == 2 {
        paf_y_control;
    }


}

func is_buffered(value){
    return $value > 0 and $value <= ceil(2 / delta_time);
}

proc hal_y_control move = true {
    # Halli's physics, which he gained by eating some kind of hollow pebble that had paper sticking to it.
    # make sure velocity changes come before gravity/accelerating forces.

    if ctrl_a == -1 {
        if jump_hold == 1 and yvel.v1 > jump_vel_smal{
            yvel.v1 = jump_vel_smal;

        }
        jump_hold = 0;
    }

    if grounded or coyote_timer.current > 0 {
        jump_hold = 0;

        # Jump
        if ctrl_a > 0 and (is_buffered(ctrl_a) or jump_buffered == 1) {
            
            if $move{
                yvel.v1 = jump_vel + 2 * (jump_incr) * abs(xvel.dx / delta_time) ;
            }
            state_machine ("play.air.up");
            grounded = false;
            jump_hold = 1;
        }

        # Spin Jump
        # if ctrl_b > 0 and (is_buffered(ctrl_b) or jump_buffered == 2){
        #     if $move{
        #         yvel.v1 = spin_jump_vel + 2 * (jump_incr) * abs(xvel.dx / delta_time) ;
        #     }
        #     state_machine ("play.air.spin");
        #     grounded = false;
        # }
        
        jump_buffered = 0;

    }

    if $move {
        local gravity = fall_gravity;
        if ctrl_a > 0 or (yvel.v1 <= 0 and puff_timer.current >= puff_cooldown * 0.75) {
            gravity = jump_gravity;
        }
        yvel = accelerate_advanced(yvel.v1, -gravity, yvel.a, -max_fall);
    }
}

proc paf_y_control {
    # Pafu's physics, which she gained by munching on a bug that was kinda spiky.

    if ctrl_a == -1 {
        if jump_hold == 1 and yvel.v1 > paf_jump_vel_smal{
            yvel.v1 = paf_jump_vel_smal;

        }
        jump_hold = 0;
    }

    if grounded or coyote_timer.current > 0 {
        jump_hold = 0;

        # Jump
        if ctrl_a > 0 and (is_buffered(ctrl_a) or jump_buffered == 1) {
            
            yvel.v1 = paf_jump_vel;
            state_machine ("play.air.up");
            grounded = false;
            jump_hold = 1;
        }

        # # Spin Jump
        # if ctrl_b > 0 and (is_buffered(ctrl_b) or jump_buffered == 2){
        #     if $move{
        #         yvel.v1 = spin_jump_vel + 2 * (jump_incr) * abs(xvel.dx / delta_time) ;
        #     }
        #     state_machine ("play.air.spin");
        #     grounded = false;
        # }
        
        jump_buffered = 0;

    }

        local gravity = paf_gravity;
        yvel = accelerate_advanced(yvel.v1, -gravity, yvel.a, -paf_max_fall);
    }

var walk_counter;
var blink_time;

proc ground_animation{
    if player == 1 and state == "play.ground.idle"{
        if animation_counter > 47 and animation_counter % 48 < delta_time{
            if random(0, 1) == 0{
                force_animation_refresh;
            }
        }
    }

    if player == 2 and "play.ground.walk" in state{
        

    }



    if "walk" in state {
        animation_counter += abs(xvel.dx);
        stop_this_script; # avoid animation counting.
    }


    animation_counter += delta_time;
}

proc air_animation{
    # something like a ceiling bonk animation might need some more thinking.
    if not jump_buffered {
        local fall_threshold = 0;
        if player == 2 {
            fall_threshold = paf_jump_vel_smal;
        }
        if yvel.v1 > fall_threshold {
            state_machine ("play.air.up");

        }
        else {
            state_machine ("play.air.down");
        }

    }

    if direction_lock.current <= 0 {
        if ctrl_right > 0 {

            this_direction = (90);
        }
        if ctrl_left > 0 {
            this_direction = (-90);
        }

    }

    animation_counter += delta_time;
}

proc animation_timing{
    # If any animations have their animation tied to something, it's controlled here. 
    # But because I haven't completely figured this system out yet, this proc also has some state changes. 
    if "puff" in state {
        stop_this_script;
    }

    # TODO: store animation name explicitly in state (for stuff like air running)
    if "ground" in state or "skid" in state{
        ground_animation;
        stop_this_script;
    }
    if "air" in state{
        air_animation;
        stop_this_script;
    }

    # if puff_timer.current == puff_cooldown {
    #     state_machine ("play.puff");
    # }

}

onflag{
    sort_depth false, false;
}

on "boot"{
    boot;
}

proc player_tick{
    puff_control;
    x_control;
    y_control;
    # actor_physics;

}



on "tick_000"{
    direction_lock  = decrement_timer(direction_lock);
    puff_timer      = decrement_timer(puff_timer);
    coyote_timer    = decrement_timer(coyote_timer);

    last_this_direction = this_direction;

    if timer_boundary_crossed(direction_lock, 0){
        state_to_direction;
    }
}

on "tick_101"{
    player_tick;
}

on "tick_cosmetics"{
    animation_timing;


}

on "tick_108" {
    actor_tick;
    # this is a special case where the animation needs to happen instantly - no 1-frame delayed state change.
    if collision_y == -1 {
        if is_buffered(ctrl_a){
            jump_buffered = 1;
            state_machine ("play.air.jumpsquat");
        }
        # if is_buffered(ctrl_b){
        #     jump_buffered = 2;
        #     state_machine ("play.air.spin");
        # }
    }
}

on "tick_display"{
    if G_game_state == "play"{
        show;
    }
    if G_game_state == "animviewer"{
        hide;
    }
}

on "load_map" {
    x_position += player_spawn_chunk_x * chunk_width;
    y_position += -player_spawn_chunk_y * chunk_height; 
}

onkey "l" {
  yvel.v1 = 5;
}