costumes
"gfx/debug/reticle.png";

on "tick_debug_last" {
    if not show_scroll_target {
        hide;
        stop_this_script;
    }
    goto_front;
    show;
    switch_costume "reticle";
    goto (camera_target_x - camera_x) * 2, (camera_target_y - camera_y) * 2;
}