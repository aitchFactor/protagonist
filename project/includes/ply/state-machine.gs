
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
    if "ledgegrab" in state {
        # "__none__" is probably the best solution cause it means we can overrule it with other states later
        # without worrying so much about order of operations
        if ledgegrab_timer.current > 0 {
        if "play.air" in new_state or "exit_puff" in new_state {
            new_state = "__none__";
        }
        if "play.ground" in new_state {
            new_state = "play.ground.ledgegrab";
        }
        }
    }

    if "play.air" in new_state {
        if "play.ground.puff" in state {
            new_state = "play.air.puff";
        }

    }

    # non-cancellable phase of puff.
    if "play" in new_state and ".puff" in state and not (".puff" in new_state or "roll" in new_state) {
        if player == 1 and puff_timer.current > (hal_puff_cooldown * 0.5){
            stop_this_script;
        } 
        if player == 2 and puff_timer.current > (paf_puff_cooldown * 0.75) {
            stop_this_script;
        }

        # cancellable phase of puff.
        if puff_timer.current > (paf_puff_cooldown * 0.5) and ctrl_left < 0 and ctrl_right < 0 and ctrl_a < 0  {
            stop_this_script;
        }
    }
    # allow puff to transition to roll.
    if ".puff" in state and "roll" in new_state {
        puff_timer.current -= paf_puff_cooldown * 0.5;

        direction_lock.current = -1;
        # don't hard reset the direction lock because we still want the expired routine to trigger
        # direction_lock.previous = -1;
    } 

    if new_state == "play.puff"{

        if "ground" in state{
            new_state = ("play.ground.puff");
        }
        if "air" in state {
            new_state = ("play.air.puff");
        }

    }

    if new_state == "play" or new_state == "play.exit_puff"{
        
        if grounded {
            new_state = "play.ground";
        }
        else {
            new_state = "play.air";
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
        if ("spin" in state or "roll" in state){
            local allowed = false;
            if "ledgegrab" in new_state {
                allowed = true;
            }

            if "ground" in new_state {
                allowed = true;
            }
            if ".puff" in new_state {
                allowed = true;
            }
            if not allowed {
                stop_this_script;
            }
        }


        # if "jump" in state and ("up" in new_state or "down" in new_state) {
        #     stop_this_script;
        # }
    }
    # ground -> skid and vice versa
    if new_state == "play.ground"{
        if xvel.v1 == 0 {
            new_state = "play.ground.idle";
            
        }
        else {
            if sign_of (xvel.v1) == sign_of(this_direction){
                if this_direction == 90{
                    new_state = "play.ground.walk._R";
                }
                else{
                    new_state = "play.ground.walk._L";
                }
            }
            else{
                new_state = "play.ground.skid";
            }
        }

    }

    if new_state == "play.air.jump" {
        if state == "play.ground.getup_jump" {
            new_state = "play.air.getup_jump";
        }
    }

    log new_state;

    if new_state == "__none__" {
        stop_this_script;
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
    if "._L" in state {
        this_direction = -90;
    }
    if "._R" in state {
        this_direction = 90;
    }
}
