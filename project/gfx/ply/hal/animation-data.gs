# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.
%include gfx/ply/hal/costume-names.gs

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
    add AnimationFrame {costume_name: "halli-stand-v01a_4",     duration: 4,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01a_1",     duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01a_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01a_3",     duration: 11,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01a_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01a_1",     duration: 4,    flip: false } to animations_queue_frames;
}

proc anim_jumpsquat {
    one_frame "halli-jump-v01a_1";

}

proc anim_air_up {
    one_frame "halli-jump-v01a_2";
}
proc anim_air_down {
    one_frame "halli-jump-v01a_3";
}


proc anim_walk {
    # Header
    add AnimationHeader {
        num_pages: 6,
        loop_start: 2,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-walk-v01a_2",      duration: 4,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_3",      duration: 7,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_4",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_5",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_6",      duration: 9,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_7",      duration: 9,    flip: false } to animations_queue_frames;

}

proc anim_skid {
    add AnimationHeader {
        num_pages: 2,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "halli-walk-v01a_8",      duration: 3,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01a_9",      duration: 3,    flip: false } to animations_queue_frames;
}

func state_animation(state) {
    # library of every animation to play for each state.
    # TODO: convert to real parsing 

    if "play" in $state {
        force_animation_refresh;
        delete animations_queue_header;
        delete animations_queue_frames;

        if "ground" in $state {
            if "skid"       in $state{
                anim_skid;
                return "anim_skid";
            }
            if "idle"       in $state {
                anim_idle;
                return "anim_idle";
            }
            if "jumpsquat"  in $state {
                anim_jumpsquat;
                return "anim_jumpsquat";
            }
            if "walk"       in $state {
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
            
            return "undefined";
        }

        return "undefined";
    }
}