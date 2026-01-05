# import for sprites that are displayed on the screen.
# features (TODO):
# - z-sorting
# - animation
# - global position offset
# - postprocess upscaling

proc sort_depth_z_flicker z_position, flicker {
    g_temp = 1;
    if not $flicker {
        until not ($z_position < z_positions[g_temp + 1]) {
            g_temp += 2;
        }
    }
    else {
        until $z_position > z_positions[g_temp + 1] {
            g_temp += 2;
        }
    }
    insert $z_position at z_positions[g_temp];
    insert "FRONT" at z_positions[g_temp];
    go_forward g_temp - 1;
}
onflag {
    hide;
    reset_timer;
    initialise;
    forever {
        loop;
    }
}