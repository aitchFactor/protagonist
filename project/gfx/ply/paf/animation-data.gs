# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.

proc paf_anim_idle {
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
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-jump_2",      duration: 6,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-jump_3",      duration: 1,   flip: false } to animations_queue_frames;

}

proc paf_anim_walk_step {
    # Header
    add AnimationHeader {
        num_pages: 3,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-walk_6",      duration: 6,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_1",      duration: 12,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_2",      duration: 12,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_3",      duration: 12,    flip: false } to animations_queue_frames;

}
proc paf_anim_walk_turn_around {
    # coming soon...
    paf_anim_walk_step;

}

proc paf_anim_walk {
    # Header
    add AnimationHeader {
        num_pages: 6,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "pafu-walk_4",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_5",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_6",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_7",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_8",      duration: 11,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "pafu-walk_9",      duration: 11,    flip: false } to animations_queue_frames;

}

proc paf_anim_skid {
    # placeholder
    paf_anim_idle;
}


proc paf_anim_spin {
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
        force_animation_refresh;
        delete animations_queue_header;
        delete animations_queue_frames;
        
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
                if "air" in $last_state{
                    paf_anim_walk_step;
                }
                if "skid" in $last_state{
                    paf_anim_walk_turn_around;
                }
                if "idle" in $last_state{
                    paf_anim_walk_step;
                }
                paf_anim_walk;
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