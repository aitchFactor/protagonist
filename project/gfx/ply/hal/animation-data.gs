# animations are stored as explicit entries of a header/frames pair.
# make sure you always insert a header and frames at the same time.
%include gfx/ply/hal/costume-names.gs
sounds "snd/*.wav";

proc hal_anim_idle {
    clear_animation;
    # Header
    add AnimationHeader {
        num_pages: 6,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    # Frames
    add AnimationFrame {costume_name: "halli-stand-v01b_4",     duration: 5,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_1",     duration: 7,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_3",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_2",     duration: 12,   flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-stand-v01b_1",     duration: 5,    flip: false } to animations_queue_frames;
}

proc hal_anim_jumpsquat {
    one_frame "halli-jump-v01b_1";
    add AnimationHeader {
        num_pages: 1,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;

}

proc hal_anim_jump {
    clear_animation;
    if abs(xvel.v1) == max_run {
        # halli momentarily runs in midair as he jumps.
        add AnimationHeader {
            num_pages: 4,
            loop_start: 0,
            loops: 0
        }   to animations_queue_header;
        # Frames
        add AnimationFrame {costume_name: "halli-walk-v01b_5",      duration: 1,    flip: false } to animations_queue_frames;
        add AnimationFrame {costume_name: "halli-walk-v01b_6",      duration: 1,    flip: false } to animations_queue_frames;
        add AnimationFrame {costume_name: "halli-walk-v01b_7",      duration: 2,    flip: false } to animations_queue_frames;
        add AnimationFrame {costume_name: "halli-walk-v01b_4",      duration: 3,    flip: false } to animations_queue_frames;
    } 

    # start_sound "jump";

    add AnimationHeader {
        num_pages: 1,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "halli-jump-v01b_2",     duration: 1,    flip: false } to animations_queue_frames;

}

proc hal_anim_air_up {
    one_frame "halli-jump-v01b_2";
}
proc hal_anim_air_down {
    one_frame "halli-jump-v01b_3";
}

proc hal_anim_walk_step {
    clear_animation;
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
proc hal_anim_walk_fromskid {
    clear_animation;
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

proc hal_anim_walk refresh = true{
    if $refresh {
        clear_animation;
    }
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

proc hal_anim_skid {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 0,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "halli-walk-v01b_8",      duration: 3,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "halli-walk-v01b_9",      duration: 3,    flip: true } to animations_queue_frames;
}

# note: spin is always clockwise regardless of direction.
proc hal_anim_spin {
    clear_animation;
    # start_sound "spin";
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

proc hal_anim_puff {
    one_frame ("halli-puff-side");
}

func hal_state_animation(state, last_state) {
    # library of every animation to play for each state.
    # TODO: convert to real parsing 

    if "play" in $state {
        
        if "jumpsquat"  in $state {
            hal_anim_jumpsquat;
            return "hal_anim_jumpsquat";
        }

        if "ground" in $state {
            if "puff"       in $state {
                hal_anim_puff;
                return "hal_anim_puff";
            }
            if "skid"       in $state{
                hal_anim_skid;
                return "hal_anim_skid";
            }
            if "idle"       in $state {
                hal_anim_idle;
                return "hal_anim_idle";
            }
            
            if "walk"  in $state {
                local refreshed = false;
                if "air" in $last_state{
                    hal_anim_walk_fromskid;
                    refreshed = true;
                }
                if "skid" in $last_state{
                    hal_anim_walk_fromskid;
                    refreshed = true;
                }
                if "idle" in $last_state{
                    hal_anim_walk_step;
                    refreshed = true;
                }
                hal_anim_walk (not refreshed);
                return "hal_anim_walk";
            }
            return "undefined";
        }
        if "air" in $state {
            if "up" in $state {
                if "ground" in $last_state{
                    hal_anim_jump;
                    return "hal_anim_jump";
                }
                else {
                    hal_anim_air_up;
                    return "hal_anim_air_up";
                }
            }
            if "down" in $state {
                hal_anim_air_down;
                return "hal_anim_air_down";
            }
            if "spin" in $state {
                hal_anim_spin;
                return "hal_anim_spin";
            }
            if "puff" in $state {
                hal_anim_puff;
                return "hal_anim_puff";
            }
            
            return "undefined";
        }

        return "undefined";
    }
}