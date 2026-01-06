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
    return round ($x * 16) / 16;
}