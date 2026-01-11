%include includes/obj.gs
%include gfx/ply/hal/animation-data.gs
%include gfx/ply/paf/animation-data.gs
costumes 
"gfx/ply/hal/*.png",
"gfx/ply/paf/*.png",
;
var SPRITE_NAME = "Animation Preview";

on "boot" {
    z_position = 255;
}

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


    # ### add animations here...
    # paf_anim_walk_step;
    # paf_anim_walk;

}