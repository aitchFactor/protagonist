%include includes/actor.gs
%include includes/input-mapping.gs
%include includes/defines.gs


%include includes/ply/attributes
%include includes/ply/hal-animation-data
%include includes/ply/paf-animation-data
%include includes/ply/hitbox-data
%include includes/ply/abilities
%include includes/ply/state-machine



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
var Timer ledgegrab_timer;
var last_grounded_y;
var last_grounded_x;
var last_this_direction;
var BoundingBox player_bounding_box;

var hp;




proc boot{
    switch_costume FR_STAND;
    x_position = -32;
    y_position = -32;
    z_position = 255;
    last_grounded_y = 0;
    last_grounded_x = 0;
    this_direction = 90;
    last_this_direction = 90;
    walk_counter = 0;
    grounded = 0;
    jump_hold = 0;
    jump_buffered = 0;
    puff_type = "";
    direction_lock = Timer{};
    x_control_lock = Timer{};
    y_control_lock = Timer{};
    puff_timer = Timer{};
    coyote_timer = Timer{};
    set_rotation_style_left_right;
    hp = 4;
    state_machine("play");

    set_player player;
    ab_normal;

    fast_collisions = true;

}




var puff_type;

proc puff_control {
    if timer_boundary_crossed(puff_timer) {
        if not ("puff" in abilities) {
            add "puff" to abilities;
        }
    }

    # restore normal movement and allow the animation to be cancelled.
    if timer_boundary_crossed(puff_timer, hal_puff_cooldown * 0.5){
        state_machine("play");
    }

    if not ("puff" in abilities){
        stop_this_script;
    }

    if ctrl_b > 0 and ctrl_b <= (4/delta_time) and puff_timer.current <= 0 { # 4 frame buffer.
        
        state_machine("play.puff");
        if "puff" in state {
            if player == 1 {
                if not grounded and ctrl_down > 0 {
                    hal_down_air;
                }
                else {
                    if ctrl_up > 0 {
                        hal_up_light;
                    }
                    else {
                        hal_side_light;
                    }
            }
            }

            if player == 2 {
                if not grounded and ctrl_down > 0 {
                    paf_down_air;
                }
                else {
                    if ctrl_up > 0 {
                        paf_up_light;
                    }
                    else {
                        paf_side_light;
                    }
                }
            }

            # push the direction of the puff to the state. (probably needs a refactor at some point)
            state_machine(state & "." & puff_type);
            delete abilities["puff" in abilities];

        }

    }


}

proc x_control move = true{
    if not ("x" in abilities) {
        stop_this_script;
    }

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
            new_state = new_state & "._R";
        }
        if ctrl_left > 0 {
            new_state = new_state & "._L";
        }
        state_machine (new_state);
    }
}

proc paf_x_control {



    local acceleration = 0;
    local deceleration = 0;
    local speed_max = "Infinity";
    local speed_min = 0;

    local new_state = "";
    if ctrl_left > 0 {
        new_state = "play.ground.walk._L";

        if xvel.v1 > -paf_walk{
            speed_max = -paf_walk;

            if xvel.v1 > paf_skid_threshold { # braking from a sprint
                acceleration += -paf_decel;
                new_state = "play.ground.skid._L";
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
            new_state = "play.ground.walk._R";

            if xvel.v1 < paf_walk{
                speed_max = paf_walk;

                if xvel.v1 < -paf_skid_threshold { # braking from sprint
                    acceleration += paf_decel;
                    new_state = "play.ground.skid._R";
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

    # don't include a state transition if we are about to jump.
    if jump_buffered {
        new_state = "";
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
        last_grounded_x = x_position;
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

    if not ("y" in abilities) {
        stop_this_script;
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
    # Halli's physics, which he learned by eating some kind of hollow pebble that had paper sticking to it.
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
            state_machine ("play.air.jump");
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
        if ctrl_a > 0 or ctrl_b > 0 or (yvel.v1 <= 0 and puff_timer.current >= hal_puff_cooldown * 0.75) {
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
            state_machine ("play.air.jump");
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
        if "jump" in state {
            fall_threshold = 0;
        }
        else {
            fall_threshold = "Infinity";
        }
        if yvel.v1 < fall_threshold {
            state_machine ("play.air.down");

        }
        # else {
        #     state_machine ("play.air.down");
        # }

    }


    if direction_lock.current <= 0 {
        if ctrl_right > 0 {

            this_direction = (90);
        }
        if ctrl_left > 0 {
            this_direction = (-90);
        }

    }
    if ".roll" in state or "getup_jump" in state {
        # run at 2x speed to allow subframe timing
        animation_counter += 2 * delta_time;
        stop_this_script;
    }

    if "ledgegrab" in state {
        # sync animation counter to ledgegrab timer
        animation_counter = paf_ledgegrab_length - ledgegrab_timer.current;
        stop_this_script;
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

    # if puff_timer.current == hal_puff_cooldown {
    #     state_machine ("play.puff");
    # }

}

proc goto_checkpoint Checkpoint check, snap_camera = false {
    x_position = $check.spawn_x;
    y_position = $check.spawn_y; 
    camera_x = $check.spawn_x;
    camera_y = $check.spawn_y;
    if $snap_camera {
        camera_x = quantise(camera_x, chunk_width, 1);
        camera_y = quantise(camera_y, chunk_height, 1);
    }

    camera_target_x = camera_x;
    camera_target_y = camera_y;

    x_scroll = -camera_x;
    y_scroll = -camera_y; 


    xvel = ContinuousVelocity{};
    yvel = ContinuousVelocity{};
    x_remainder = 0;
    y_remainder = 0;
}

%define ev player_events[1]
proc receive_events {
    repeat length player_events {
        add ev.type to debug_log;
        if ev.type == "pogo" {
            if player == 1 {
                yvel.v1 = hal_pogo_vel;
            }
            if player == 2 {
                yvel.v1 = paf_jump_vel * 0.75;
                state_machine ("play.air.roll");
            }
        } 

        delete player_events[1];
    }
}

proc check_spike {
    if yvel.v1 > 0 {
        stop_this_script;
    }
    if bitmask(get_colliding_types(), BgLayerTypeBit.Spike) {
        start_sound "thud";
        if respawn_mode == RespawnMode.Big {
            broadcast "player_respawn_big";
        }
        else {
            broadcast "player_respawn_small";
        }
        broadcast "reload_map";
    }
}

proc check_screen_transition {
    local chunk_x = x_to_chunk(x_position);
    local chunk_y = y_to_chunk(y_position);
    if chunk_x < map_info.map_left_edge {
        area_transition_direction = Direction.Left;
    } 
    if chunk_x >= map_info.map_right_edge  {
        area_transition_direction = Direction.Right;
    }
    if chunk_y < map_info.map_top_edge  {
        area_transition_direction = Direction.Up;

    }
    if chunk_y >= map_info.map_bottom_edge  {
        area_transition_direction = Direction.Down;
    } 
    if area_transition_direction != "" {
        G_game_state = "area_transition";
        chunk_query_x = chunk_x;
        chunk_query_y = chunk_y;
    }
}

func _check_grab() {



    # check grab box is in a wall
    bounding_box = bb_paf_grab_1;
    add bb_paf_grab_1 to debug_bb_list;
    local bits = get_colliding_types();
    if not bitmask(bits, BgLayerTypeBit.Solid) {
        return false;
    }
    if bitmask(bits, BgLayerTypeBit.Spike) {
        return false;
    }


    # check grab box is in the corner of a wall
    bounding_box = bb_paf_grab_2;
    add bb_paf_grab_2 to debug_bb_list;
    bits = get_colliding_types();
    if bitmask(bits, BgLayerTypeBit.Solid) or bitmask (bits, BgLayerTypeBit.Spike) {
        return false;
    }

    return true;
}

proc check_grab {
    if ledgegrab_timer.current > 0 {
        stop_this_script;
    }

    if grounded {
        stop_this_script;
    }

    if player != 2 {
        stop_this_script;
    }

    # need to be holding a direction to grab
    if ctrl_left < 0 and ctrl_right < 0 {
        stop_this_script;
    }


    if _check_grab() {
        state_machine ("play.air.ledgegrab");

        if "ledgegrab" in state {

            ledgegrab_timer.current = paf_ledgegrab_length;
            direction_lock.current = paf_ledgegrab_length;

            delete abilities;
            # snap pafu to the corner 
            bounding_box = player_bounding_box;
            x_remainder = 0;
            y_remainder = 0;

            move_x (2 * sign_of(this_direction));

            bounding_box = bb_paf_grab_2;
            move_y (2);
            move_y (-15);

            bounding_box = player_bounding_box;
            move_y (5);

        }
    }

    bounding_box = player_bounding_box;
}

%define getup_frame_crossed(x) timer_boundary_crossed(ledgegrab_timer, paf_ledgegrab_length - x)
%define getup_frame(x) paf_ledgegrab_length - x 

proc paf_getup {
    if not ("ledgegrab" in state) {
        stop_this_script;
    }
    

    local sign = sign_of(this_direction);

    if getup_frame_crossed(2) {}

    if getup_frame_crossed(5)   {move_y(1);}
    if getup_frame_crossed(8)   {move_y(6);}
    if getup_frame_crossed(12)  {move_y(10); move_x(3 * sign); move_y(-2);}
    if getup_frame_crossed(15)  {move_x(2 * sign);}    
    if getup_frame_crossed(18)  {move_x(2 * sign);}

    # cancel into jump
    if ledgegrab_timer.current <= getup_frame(12) {
        if ctrl_a > 0 {
            ledgegrab_timer.current = 0;
            jump_buffered = true;
            state_machine("play.ground.getup_jump");
        }

        # can attacks be buffered from ledge?
        if ctrl_b > 0 {
            ledgegrab_timer.current = 0;
        }
    }

    # cancel into walk
    if ledgegrab_timer.current <= getup_frame(18) {
        if ctrl_left > 0 or ctrl_right > 0 {
            ledgegrab_timer.current = 0;
        }
    }
    if timer_boundary_crossed(ledgegrab_timer) {
        ab_normal;
        direction_lock.current = 0;
    }
}

on "boot"{
    boot;
}

proc player_tick{
    paf_getup;
    receive_events;
    puff_control;
    x_control;
    y_control;
    # actor_physics;

}

on "tick_debug_first" {
    # think ledgegrab_timer.current & ", " & state;

    # if bb_touching(BgLayerTypeColour.Solid) {
    #     # think "stuck!!!";
    # }
}

on "tick_000"{
    direction_lock  = decrement_timer(direction_lock);
    puff_timer      = decrement_timer(puff_timer);
    coyote_timer    = decrement_timer(coyote_timer);
    ledgegrab_timer = decrement_timer(ledgegrab_timer);
    # delete player_events; 
    delete debug_bb_list;

    switch_costume hurtbox;

    last_this_direction = this_direction;

    if timer_boundary_crossed(direction_lock, 0){
        state_to_direction;
    }
}

on "tick_102"{
    player_tick;
}

on "tick_201" {
    check_screen_transition;
    check_spike;
    
    
}

on "tick_cosmetics"{
    animation_timing;


}

on "tick_108" {
    local interrupt = false;

    if "ledgegrab" in state {
        interrupt = true;


    }

    if not interrupt {
        actor_tick;
    }
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


    check_grab;


}

on "level_end" {
    state_machine ("level_end.air");
    xvel = ContinuousVelocity{};
    yvel = ContinuousVelocity{};
}

on "tick_level_end" {
    yvel = accelerate_advanced(yvel.v1, -fall_gravity, yvel.a, -max_fall);
    # yvel = accelerate_advanced(-1, 0, 0, -4);
    check_grounded;
    if grounded {
        state_machine ("level_end.ground");
    }
    if state == "level_end.ground" {
        xvel = accelerate_advanced(1.25, 0, 0, 1.25);
    }
    this_direction = 90;
}

on "tick_display"{
    if G_game_state == "play"{
        show;
    }
    if G_game_state == "animviewer"{
        hide;
    }
}

on "tick_hitbox_view" {
    if hitbox_view {
        hide;
    }
}

on "load_map_002" {
    goto_checkpoint unpack_checkpoint(checkpoints[map_info.spawn_checkpoint_index]);

}

on "player_respawn_big" {
    goto_checkpoint unpack_checkpoint(checkpoints[current_checkpoint_index]), true;
}

on "player_respawn_small" {
    goto_checkpoint (mini_checkpoint);
}

proc set_player p{
    if $p == 1 {
        hurtbox = "stand_14x16";

        player_bounding_box = bb_hal_stand;

        set_bounding_box box: player_bounding_box;
    }
    if $p == 2 {
        hurtbox = "stand-10x16";
        player_bounding_box = bb_paf_stand;
        set_bounding_box(player_bounding_box);
    }
    switch_costume hurtbox;
}

on "switch_player" {
    player = ((player) % 2) + 1; 
    set_player player;
}

onkey "l" {
  yvel.v1 = 5;
}

onkey "8" {
    current_checkpoint_index = 6;
    broadcast "player_respawn_big";
    broadcast "reload_map";
}