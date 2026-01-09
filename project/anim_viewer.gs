%include includes/obj.gs
%include gfx/ply/hal/animation-data.gs
costumes 
"gfx/ply/hal/*.png",
;

on "tick_cosmetics"{
    if G_game_state == "animviewer"{
        show;
        animation_counter += delta_time;
    }
    else {
        hide;
    }
}

on "set_debug_options"{
    # G_game_state = "animviewer";


    ### add animations here...
    # anim_spin;

}