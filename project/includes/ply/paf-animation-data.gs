# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.

proc paf_anim_idle refresh = true {
    if $refresh {
        clear_animation;
    }
    # Header
    add AnimationHeader {
        num_pages: 5,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-stand_4",     duration: 5,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 1,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_2",     duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_3",     duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 5,    flip: false } to animations_queue_frames;
}

proc paf_anim_jumpsquat {
    # placeholder
    paf_anim_air_up;

}

proc paf_anim_air_up {
    one_frame "pafu-jump_1";
}

proc paf_anim_jump {
    start_sound "jump-paf";
    clear_animation;
    add AnimationHeader {
        num_pages: 3,
        loop_start: 2,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-jump_1",      duration: 22,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump_2",      duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump_3",      duration: 1,   flip: false } to animations_queue_frames;
}

proc paf_anim_jump_short {
    # should only be called if the current animation is "jump"
    local index = (length animations_queue_header) + 1;
    add AnimationHeader {
        num_pages: 3,
        loop_start: 1,
        loops: 2
    } to animations_queue_header;

    add AnimationFrame {costume_name: "pafu-jump-short_1",      duration: 4,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump-short_2",      duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump-short_1",      duration: 3,   flip: false } to animations_queue_frames;

    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    } to animations_queue_header;

    add AnimationFrame {costume_name: "pafu-jump-short_3",      duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump_3",      duration: 1,   flip: false } to animations_queue_frames;


    swap_to_animation index;
}

proc paf_anim_air_down refresh = true {
    if $refresh {
        clear_animation;
    }
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-jump-short_3",      duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump_3",      duration: 1,   flip: false } to animations_queue_frames;

}

proc paf_anim_walk_step refresh = true {
    if $refresh {
        clear_animation;
    }
    # Header
    add AnimationHeader {
        num_pages: 4,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-walk_6",      duration: 6,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_1",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_2",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_3",      duration: 10,    flip: false } to animations_queue_frames;

}
proc paf_anim_walk_land {
    clear_animation;
    # Header
    add AnimationHeader {
        num_pages: 3,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-walk_1",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_2",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_3",      duration: 9,    flip: false } to animations_queue_frames;

}
%define paf_turn_direction_lock 10
proc paf_anim_walk_turn_around {
    clear_animation;
    add AnimationHeader {
        num_pages: 6,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;

    # unused; I was wrong.
    # direction_lock.current = paf_turn_direction_lock / paf_walk;
    add AnimationFrame {costume_name: "pafu-stand_4",     duration: 2,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-turn_1",      duration: paf_turn_direction_lock - 2,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-turn_2",      duration: 6,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_1",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_2",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_3",      duration: 10,    flip: false } to animations_queue_frames;
}

proc paf_anim_walk refresh = true, duration = 9 {
    if $refresh {
        clear_animation;
    }
    # Header
    add AnimationHeader {
        num_pages: 6,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-walk_4",      duration: $duration,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_5",      duration: $duration,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_6",      duration: $duration,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_7",      duration: $duration,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_8",      duration: $duration,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_9",      duration: $duration,    flip: false } to animations_queue_frames;

}

proc paf_anim_level_clear {
    paf_anim_walk true, 2;
}

proc paf_anim_skid {
    # placeholder
    paf_anim_idle;
}


proc paf_anim_spin {
    clear_animation;
    start_sound "spin";
    add AnimationHeader {
        num_pages: 12,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_2",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_3",     duration: 2,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 2,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_2",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_3",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 2,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_2",     duration: 2,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_3",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_1",     duration: 2,   flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_2",     duration: 2,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-stand_3",     duration: 2,   flip: false } to animations_queue_frames;

}

proc paf_anim_puff_side {
    start_sound "puff";
    one_frame ("pafu-puff-side");
}

proc paf_anim_puff_up {
    start_sound "puff";
    one_frame ("pafu-puff-up");
}

proc paf_anim_puff_down {
    start_sound "puff";
    one_frame ("pafu-puff-down");
}

proc paf_anim_ledgegrab {
    clear_animation;
    add AnimationHeader {
        num_pages: 7,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;

    if yvel.v1 < paf_gravity {
        add AnimationFrame {costume_name: "pafu-ledgegrab_1",     duration: 2,   flip: false } to animations_queue_frames;
    }
    else {
        add AnimationFrame {costume_name: "pafu-ledgegrab-up_1",     duration: 2,   flip: false } to animations_queue_frames;
    }
    
    add AnimationFrame {costume_name: "pafu-ledgegrab_2",     duration: 3,   flip: false } to animations_queue_frames;  
    add AnimationFrame {costume_name: "pafu-ledgegrab_3",     duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-ledgegrab_4",     duration: 4,   flip: false } to animations_queue_frames;  
    add AnimationFrame {costume_name: "pafu-ledgegrab_5",     duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-ledgegrab_6",     duration: 3,   flip: false } to animations_queue_frames;  
    add AnimationFrame {costume_name: "pafu-ledgegrab_7",     duration: 5,   flip: false } to animations_queue_frames;
    start_sound "grab_snap";  
}

proc paf_anim_roll loops = 3 {
    clear_animation;
    add AnimationHeader {
        num_pages: 6,
        loop_start: 0,
        loops: $loops
    }   to animations_queue_header;
    
     
    add AnimationFrame {costume_name: "pafu-roll_3",     duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-roll_4",     duration: 3,   flip: false } to animations_queue_frames;  
    add AnimationFrame {costume_name: "pafu-roll_5",     duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-roll_6",     duration: 3,   flip: false } to animations_queue_frames;  
    add AnimationFrame {costume_name: "pafu-roll_1",     duration: 3,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-roll_2",     duration: 3,   flip: false } to animations_queue_frames; 

    paf_anim_air_down refresh: false;
}

proc paf_anim_land {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    
    add AnimationFrame {costume_name: "pafu-ledgegrab_8",     duration: 5,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-ledgegrab_9",     duration: 5,   flip: false } to animations_queue_frames; 
}


func paf_state_animation(state, last_state) {
    # library of every animation to play for each state.
    # TODO: convert to real parsing 

    if "play" in $state {
        # force_animation_refresh;
        # delete animations_queue_header;
        # delete animations_queue_frames;

        if "ledgegrab" in $state and "ledgegrab" in $last_state {
            # don't restart the animation
            return "paf_anim_ledgegrab";
        }
        
        if "jumpsquat"  in $state {
            paf_anim_jumpsquat;
            return "paf_anim_jumpsquat";
        }

        if "ground" in $state {
            if "puff"       in $state {
                if "side" in $state {
                    paf_anim_puff_side;
                    return "paf_anim_puff_side";
                }
                if "up" in $state {
                    paf_anim_puff_up;
                    return "paf_anim_puff_up";
                }
                if "down" in $state {
                    paf_anim_puff_down;
                    return "paf_anim_puff_down";
                }
            }
            if "skid"       in $state{
                paf_anim_skid;
                return "paf_anim_skid";
            }
            if "idle"       in $state {
                local refreshed = false;
                if "air" in $last_state or "ledgegrab" in $last_state {
                    paf_anim_land;
                    refreshed = true;
                }
                paf_anim_idle not refreshed;
                return "paf_anim_idle";
            }
            
            if "walk"  in $state {
                local refreshed = false;
                if "air" in $last_state or "ledgegrab" in $last_state {
                    paf_anim_walk_land;
                    refreshed = true;
                }
                if "skid" in $last_state{
                    paf_anim_walk_turn_around;
                    refreshed = true;
                }
                if ("._L" in $state and last_this_direction == 90) or
                    ("._R" in $state and last_this_direction == -90) {
                        paf_anim_walk_turn_around;
                }
                else {
                    if "idle" in $last_state{
                        paf_anim_walk_step;
                    }
                }
                refreshed = true;
                if "puff" in $last_state {
                    refreshed = false;
                }
                paf_anim_walk (not refreshed);
                return "paf_anim_walk";
            }
            return "undefined";
        }
        if "air" in $state {
            if "ledgegrab" in $state {
                paf_anim_ledgegrab;
                return "paf_anim_ledgegrab";
            }
            
            if "puff"       in $state {
                if "side" in $state {
                    paf_anim_puff_side;
                    return "paf_anim_puff_side";
                }
                if "up" in $state {
                    paf_anim_puff_up;
                    return "paf_anim_puff_up";
                }
                if "down" in $state {
                    paf_anim_puff_down;
                    return "paf_anim_puff_down";
                }
            }
            if "jump" in $state {
                if "getup_jump" in $last_state {
                    start_sound "jump-paf";
                    paf_anim_roll 1;
                    return "paf_anim_roll";
                }
                paf_anim_jump;
                return "paf_anim_jump";
            }

            if "up" in $state {
                if $last_state == "play.air.jump"{
                    return "paf_anim_jump";
                }
                paf_anim_air_up;
                return "paf_anim_air_up";

            }
            if "down" in $state {
                if $last_state == "play.air.jump"{
                    paf_anim_jump_short;
                    return "paf_anim_jump_short";
                }
                if $last_state == "play.air.getup_jump" {
                    return "paf_anim_roll";
                }

                # this one's redundant but oh well
                if $last_state == "play.air.roll" {
                    return "paf_anim_roll";
                }
                paf_anim_air_down;
                return "paf_anim_air_down";
            }
            if "spin" in $state {
                paf_anim_spin;
                return "paf_anim_spin";
            }
            if "roll" in $state {
                paf_anim_roll;
                return "paf_anim_roll";
            }

            return "undefined";
        }

        return "undefined";
    }
    if "level_end" in $state {
        if "ground" in $state {
            paf_anim_level_clear;
        }
        if "air" in $state {
            paf_anim_air_down;
        }
    }
}