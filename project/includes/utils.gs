func bool_to_sign (x){
    if $x {
        return 1;
    }
    else {
        return -1;
    }
}

func sign_of(x){
    return bool_to_sign($x > 0);
}

func round_256(x){
    local round_to = 256;
    return round ($x * round_to) / round_to;
}

func get_target_fps(){
    return 60 / delta_time;
}

struct Timer {
    current = -1,
    previous = -1,
};

func decrement_timer (Timer timer) Timer {
    # Decrement a Timer struct.
    # The decrease rate is determined by delta_time, so this is useful for anything that needs to have the same duration
    # independent of the target frame rate.
    # Use 
    # Usage example:
    # my_timer = decrement_timer (my_timer)

    if round_256($timer.current - delta_time) <= 0 {
        return Timer {current: 0, previous: $timer.current};
    }

    return Timer{current: round_256($timer.current - delta_time), previous: $timer.current};

}

func timer_boundary_crossed (Timer timer, boundary = 0) {
    if $timer.previous > $boundary and $timer.current <= $boundary {
        return true;
    }
}