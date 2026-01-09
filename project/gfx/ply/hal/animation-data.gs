# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.
%include gfx/ply/hal/costume-names.gs
sounds "snd/*.wav";

proc one_frame costume_name {
    # Header
    add AnimationHeader {
        num_pages: 1,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: $costume_name,            duration: 1,    flip: false  } to animations_queue_frames;

}

proc anim_idle {
    # Header
    add AnimationHeader {
        num_pages: 6,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-stand-v01b_4",     duration: 4,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_1",     duration: 8,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_3",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_1",     duration: 4,    flip: false } to animations_queue_frames;
}

proc anim_jumpsquat {
    one_frame "halli-jump-v01a_1";

}

proc anim_air_up {
    start_sound "jump";
    one_frame "halli-jump-v01a_2";
}
proc anim_air_down {
    one_frame "halli-jump-v01a_3";
}

proc anim_walk_step {
    # Header
    add AnimationHeader {
        num_pages: 2,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-walk-v01b_2",      duration: 4,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_3",      duration: 7,   flip: false } to animations_queue_frames;

}
proc anim_walk_fromskid {
    # Header
    add AnimationHeader {
        num_pages: 5,
        loop_start: 0,
        loops: 0
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-walk-v01b_3",      duration: 5,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_4",      duration: 6,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_5",      duration: 7,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_6",      duration: 8,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_7",      duration: 9,    flip: false } to animations_queue_frames;

}

proc anim_walk {
    # Header
    add AnimationHeader {
        num_pages: 4,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-walk-v01b_4",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_5",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_6",      duration: 10,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_7",      duration: 10,    flip: false } to animations_queue_frames;

}

proc anim_skid {
    add AnimationHeader {
        num_pages: 2,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "halli-walk-v01b_8",      duration: 3,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_9",      duration: 3,    flip: true } to animations_queue_frames;
}

# note: spin is always clockwise regardless of direction.
proc anim_spin {
    start_sound "spin";
    add AnimationHeader {
        num_pages: 4,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-jump-v01a_5",      duration: 2,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-jump-v01a_6",      duration: 2,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-jump-v01a_7",      duration: 2,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-jump-v01a_6",      duration: 2,    flip: false } to animations_queue_frames;

}

func state_animation(state, last_state) {
    # library of every animation to play for each state.
    # TODO: convert to real parsing 

    if "play" in $state {
        force_animation_refresh;
        delete animations_queue_header;
        delete animations_queue_frames;
        
        if "jumpsquat"  in $state {
            anim_jumpsquat;
            return "anim_jumpsquat";
        }

        if "ground" in $state {
            if "skid"       in $state{
                anim_skid;
                return "anim_skid";
            }
            if "idle"       in $state {
                anim_idle;
                return "anim_idle";
            }
            
            if "walk"  in $state {
                if "air" in $last_state{
                    anim_walk_fromskid;
                }
                if "skid" in $last_state{
                    anim_walk_fromskid;
                }
                if "idle" in $last_state{
                    anim_walk_step;
                }
                anim_walk;
                return "anim_walk";
            }
            return "undefined";
        }
        if "air" in $state {
            if "up" in $state {
                anim_air_up;
                return "anim_air_up";
            }
            if "down" in $state {
                anim_air_down;
                return "anim_air_down";
            }
            if "spin" in $state {
                anim_spin;
                return "anim_spin";
            }
            
            return "undefined";
        }

        return "undefined";
    }
}