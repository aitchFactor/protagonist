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

func round_16(x){
    local round_to = 256;
    return round ($x * round_to) / round_to;
}