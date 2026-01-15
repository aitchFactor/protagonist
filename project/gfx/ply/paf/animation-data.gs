# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.

proc paf_anim_idle {
    clear_animation;
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
    # start_sound "jump";
    one_frame "pafu-jump_1";
}
proc paf_anim_air_down {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-jump_2",      duration: 6,   flip: false } to animations_queue_frames;
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

    direction_lock.current = paf_turn_direction_lock / paf_walk;
    add AnimationFrame {costume_name: "pafu-stand_4",     duration: 2,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-turn_1",      duration: paf_turn_direction_lock - 2,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-turn_2",      duration: 6,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_1",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_2",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_3",      duration: 10,    flip: false } to animations_queue_frames;
}

proc paf_anim_walk refresh = true {
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
    add AnimationFrame {costume_name: "pafu-walk_4",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_5",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_6",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_7",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_8",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_9",      duration: 9,    flip: false } to animations_queue_frames;

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


func paf_state_animation(state, last_state) {
    # library of every animation to play for each state.
    # TODO: convert to real parsing 

    if "play" in $state {
        # force_animation_refresh;
        # delete animations_queue_header;
        # delete animations_queue_frames;
        
        if "jumpsquat"  in $state {
            paf_anim_jumpsquat;
            return "paf_anim_jumpsquat";
        }

        if "ground" in $state {
            if "skid"       in $state{
                paf_anim_skid;
                return "paf_anim_skid";
            }
            if "idle"       in $state {
                paf_anim_idle;
                return "paf_anim_idle";
            }
            
            if "walk"  in $state {
                local refreshed = false;
                if "air" in $last_state{
                    paf_anim_walk_land;
                    refreshed = true;
                }
                if "skid" in $last_state{
                    paf_anim_walk_turn_around;
                    refreshed = true;
                }
                if (".L" in $state and last_this_direction == 90) or
                    (".R" in $state and last_this_direction == -90) {
                        paf_anim_walk_turn_around;
                }
                else {
                    if "idle" in $last_state{
                        paf_anim_walk_step;
                    }
                }
                refreshed = true;
                paf_anim_walk (not refreshed);
                return "paf_anim_walk";
            }
            return "undefined";
        }
        if "air" in $state {
            if "up" in $state {
                paf_anim_air_up;
                return "paf_anim_air_up";
            }
            if "down" in $state {
                paf_anim_air_down;
                return "paf_anim_air_down";
            }
            if "spin" in $state {
                paf_anim_spin;
                return "paf_anim_spin";
            }
            
            return "undefined";
        }

        return "undefined";
    }
}