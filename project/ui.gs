costumes "gfx/ui/*.png", "gfx/bg/black.png";
%define next key_pressed ("a") or key_pressed ("left arrow") or key_pressed ("d") or key_pressed ("right arrow")
on "configure" {
    switch_costume "black";
    show;
    goto 0, 0;
    set_size 200;
    goto_front;
    ask "What FPS? (type 30 if not sure)";
    delta_time = answer();
    delta_time += 1;
    delta_time -= 1;
    if delta_time == answer() {
        delta_time = 60 / answer();
    }
    else {
        delta_time = 2;
    }
    if delta_time == 0 {
        delta_time = 2;
    }
    switch_costume "select";
    set_size 200;
    clone;
    goto_front;
    switch_costume "halli";
    player = 1;
    until key_pressed("z") or key_pressed ("space") or key_pressed ("m") or key_pressed ("enter") {
        if (next) {
            if costume_name() == "halli" {
                switch_costume "pafu";
                player = 2;
            }
            else {
                switch_costume "halli";
                player = 1;
            }
        }
        until not (next){};
    }
    broadcast_and_wait "ui_refresh";
    goto -64, 0;
    clone;
    goto 64, 0;
    switch_costume "start";
    clone;
    switch_costume "black";
    go_backward 2;
    wait 1.5;

    broadcast_and_wait "ui_refresh";
    hide;

}

on "ui_refresh" {
    delete_this_clone;
}