%include includes/sprite-engine.gs

### Scripts - sprites importing this file will contain this script.
var SPRITE_NAME = "Unnamed Sprite";
var clone_id = "root";
var z_position = "-Infinity";

var x_position;
var y_position;


# note: scroll values are local; use a manager sprite to sync sprite scrolls on different layers
var x_scroll;
var y_scroll;

var last_hurtbox; # hurtbox also means collision boxes.

var state;


proc sprite_boot {
    if true{
        delete_this_clone;
    }
    clear_graphic_effects;
    clone_id = "root";
    x_position = 0;
    y_position = 0;
    z_position = 0;

    x_scroll = 0;
    y_scroll = 0;

    last_hurtbox = 0;
    set_size 100;

    state = "boot";
    
}

on "boot"{

    sprite_boot;
}

on "tick_zsort" {
    sort_depth z_position, false;
}
on "tick_display"{
    
}

on "tick_000"{
    switch_costume last_hurtbox;
    set_size 800;
    goto x_position + x_scroll, y_position + y_scroll;
    set_size 100;

}

on "tick_display"{
    set_size 800;
    goto round(x_position + x_scroll) * 2, round(y_position + y_scroll) * 2;
    set_size 200;
}
