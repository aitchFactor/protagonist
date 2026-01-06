costumes "blank.png";
var temp;
var temp1;
var temp2;
list input_raw;

on "boot" {
    boot;
}
on "tick_readinput" {
    get_input_data;
}
nowarp proc poll_input_for_using button, input1, input2, input3, input4 {
    g_temp += 1;
    g_dict_key = $button in input_raw;
    temp2 = "false";
    sub_poll_slot key_pressed($input1), 1;
    sub_poll_slot key_pressed($input2), 2;
    sub_poll_slot key_pressed($input3), 3;
    sub_poll_slot $input4, 4;
    temp = input_raw[g_dict_key + 2];
    temp1 = key_pressed($input1) or key_pressed($input2) or (key_pressed($input3) or $input4);
    if temp1 == "true" {
        if not (temp > 0) or temp2 == "true" {
            temp = 0;
            input_raw[g_dict_key + 4] += 1;
        }
        temp += 1;
        input_raw[g_dict_key + 3] += 1;
    }
    else {
        if not (temp < 0) {
            temp = 0;
        }
        temp += -1;
    }

    input_raw[g_dict_key + 2] = temp;
}
proc get_input_data {
    g_temp = 0;
    poll_input_for_using "U", "w", "up arrow", "", false;
    poll_input_for_using "D", "s", "down arrow", "", false;
    poll_input_for_using "L", "a", "left arrow", "", mouse_down() and mouse_x() < 0;
    poll_input_for_using "R", "d", "right arrow", "", mouse_down() and mouse_x() > 0;
    poll_input_for_using "A", "m", "z", "", false;
    poll_input_for_using "B", "n", "x", "", false;
    poll_input_for_using "X", "j", "v", "", false;
    poll_input_for_using "Y", "h", "v", "", false;
    poll_input_for_using "SL", "q", "shift", "", false;
    poll_input_for_using "SR", "e", "space", "", false;
    poll_input_for_using "START", "p", "", "", false;
    filter_input_compare 1, 2; # up/down filtering
    filter_input_compare 2, 1; 
    filter_input_compare 3, 4; # left/right filtering
    filter_input_compare 4, 3;
    
    local i = 1;
    until i > 7{
        filter_input_compare (i + 4), false;
        i++;
    }

    ctrl_up = input[1];
    ctrl_down = input[2];
    ctrl_left = input[3];
    ctrl_right = input[4];
    ctrl_a = input[5];
    ctrl_b = input[6];
    ctrl_x = input[7];
    ctrl_y = input[8];
    ctrl_sl = input[9];
    ctrl_sr = input[10];
    ctrl_start = input[11];
}
proc boot {
    set_size 200;
    goto -188, -128;
    clear_graphic_effects;
    hide;
    z_position = 0;
    delete input_raw;
    init_add_to_input_raw "U";
    init_add_to_input_raw "D";
    init_add_to_input_raw "L";
    init_add_to_input_raw "R";
    init_add_to_input_raw "A";
    init_add_to_input_raw "B";
    init_add_to_input_raw "X";
    init_add_to_input_raw "Y";
    init_add_to_input_raw "SL";
    init_add_to_input_raw "SR";
    init_add_to_input_raw "START";
    delete input;
    add "U" to input;
    add "D" to input;
    add "L" to input;
    add "R" to input;
    add "A" to input;
    add "B" to input;
    add "X" to input;
    add "Y" to input;
    add "SL" to input;
    add "SR" to input;
    add "START" to input;
}
nowarp proc press_any_key {
    g_last_kb = "";
    until key_pressed("any") or mouse_down() {}
    if mouse_down() {
        g_last_kb = "mouse";
    }
    if key_pressed("space") {
        g_last_kb = "space";
    }
    if key_pressed("up arrow") {
        g_last_kb = "up arrow";
    }
    if key_pressed("down arrow") {
        g_last_kb = "down arrow";
    }
    if key_pressed("right arrow") {
        g_last_kb = "right arrow";
    }
    if key_pressed("enter") {
        g_last_kb = "enter";
    }
    if key_pressed("a") {
        g_last_kb = "a";
    }
    if key_pressed("b") {
        g_last_kb = "b";
    }
    if key_pressed("c") {
        g_last_kb = "c";
    }
    if key_pressed("d") {
        g_last_kb = "d";
    }
    if key_pressed("e") {
        g_last_kb = "e";
    }
    if key_pressed("f") {
        g_last_kb = "f";
    }
    if key_pressed("g") {
        g_last_kb = "g";
    }
    if key_pressed("h") {
        g_last_kb = "h";
    }
    if key_pressed("i") {
        g_last_kb = "i";
    }
    if key_pressed("j") {
        g_last_kb = "j";
    }
    if key_pressed("k") {
        g_last_kb = "k";
    }
    if key_pressed("l") {
        g_last_kb = "l";
    }
    if key_pressed("m") {
        g_last_kb = "m";
    }
    if key_pressed("n") {
        g_last_kb = "n";
    }
    if key_pressed("o") {
        g_last_kb = "o";
    }
    if key_pressed("p") {
        g_last_kb = "p";
    }
    if key_pressed("q") {
        g_last_kb = "q";
    }
    if key_pressed("r") {
        g_last_kb = "r";
    }
    if key_pressed("s") {
        g_last_kb = "s";
    }
    if key_pressed("t") {
        g_last_kb = "t";
    }
    if key_pressed("u") {
        g_last_kb = "u";
    }
    if key_pressed("v") {
        g_last_kb = "v";
    }
    if key_pressed("w") {
        g_last_kb = "w";
    }
    if key_pressed("x") {
        g_last_kb = "x";
    }
    if key_pressed("y") {
        g_last_kb = "y";
    }
    if key_pressed("z") {
        g_last_kb = "z";
    }
    if key_pressed(0) {
        g_last_kb = 0;
    }
    if key_pressed(1) {
        g_last_kb = 1;
    }
    if key_pressed(2) {
        g_last_kb = 2;
    }
    if key_pressed(3) {
        g_last_kb = 3;
    }
    if key_pressed(4) {
        g_last_kb = 4;
    }
    if key_pressed(5) {
        g_last_kb = 5;
    }
    if key_pressed(6) {
        g_last_kb = 6;
    }
    if key_pressed(7) {
        g_last_kb = 7;
    }
    if key_pressed(8) {
        g_last_kb = 8;
    }
    if key_pressed(9) {
        g_last_kb = 9;
    }
    if key_pressed("-") {
        g_last_kb = "-";
    }
    if key_pressed(",") {
        g_last_kb = ",";
    }
    if key_pressed(".") {
        g_last_kb = ".";
    }
    if key_pressed("`") {
        g_last_kb = "`";
    }
    if key_pressed("=") {
        g_last_kb = "=";
    }
    if key_pressed("[") {
        g_last_kb = "[";
    }
    if key_pressed("]") {
        g_last_kb = "]";
    }
    if key_pressed("\\") {
        g_last_kb = "\\";
    }
    if key_pressed(";") {
        g_last_kb = ";";
    }
    if key_pressed("'") {
        g_last_kb = "'";
    }
    if key_pressed("/") {
        g_last_kb = "/";
    }
    if key_pressed("backspace") {
        g_last_kb = "backspace";
    }
    if key_pressed("delete") {
        g_last_kb = "delete";
    }
    if key_pressed("shift") {
        g_last_kb = "shift";
    }
    if key_pressed("caps lock") {
        g_last_kb = "caps lock";
    }
    if key_pressed("scroll lock") {
        g_last_kb = "scroll lock";
    }
    if key_pressed("control") {
        g_last_kb = "control";
    }
    if key_pressed("escape") {
        g_last_kb = "escape";
    }
    if key_pressed("insert") {
        g_last_kb = "insert";
    }
    if key_pressed("home") {
        g_last_kb = "home";
    }
    if key_pressed("end") {
        g_last_kb = "end";
    }
    if key_pressed("page up") {
        g_last_kb = "page up";
    }
    if key_pressed("page down") {
        g_last_kb = "page down";
    }
}
nowarp proc init_add_to_input_raw thing {
    add $thing to input_raw;
    add "mapping" to input_raw;
    add "holdtime" to input_raw;
    add "cumulative" to input_raw;
    add "presses" to input_raw;
    add "key1" to input_raw;
    add "key2" to input_raw;
    add "key3" to input_raw;
    add "key4" to input_raw;
}
nowarp proc sub_poll_slot input5, slot {
    temp = input_raw[g_dict_key + ($slot + 4)];
    if $input5 {
        if not (temp > 0) {
            temp = 0;
        }
        temp += 1;
    }
    else {
        if not (temp < 0) {
            temp = 0;
        }
        temp += -1;
    }
    if temp == 1 {
        temp2 = "true";
    }

    input_raw[g_dict_key + ($slot + 4)] = temp;

}
nowarp proc filter_input_compare i, j {
    g_dict_key = $i * 9 - 8;
    temp1 = not (input_raw[g_dict_key + 2] > 0 == input[$i] > 0);
    temp = (input_raw[g_dict_key + 2] > 0) * 2 - 1;
    if not ($j == "") {
        temp2 = input_raw[$j * 9 - 8 + 2];
        if not (temp2 > input_raw[g_dict_key + 2]) and temp2 > 0 {
            temp1 = input[$i] > 0;
            temp = -1;
        }
    }
    if temp1 == "true" {
        input[$i] = 0;
    }
    input[$i] += temp;
}
