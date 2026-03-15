%include includes/obj.gs
%include includes/ply/hal-animation-data.gs
%include includes/ply/paf-animation-data.gs
costumes 
"blank.png" as "000_blank",
"gfx/ply/hal/*.png",
"gfx/ply/paf/*.png",
;
var SPRITE_NAME = "Animation Preview";

on "boot" {
    z_position = -999;
}

on "tick_cosmetics"{
    if G_game_state == "animviewer"{
        hidden = 0;
        show;
        animation_counter += delta_time;
    }
    else {
        hidden = 1;
    }
}

on "set_debug_options"{
    # G_game_state = "animviewer";


    # # ### add animations here...

    # paf_anim_ledgegrab;

    # paf_anim_walk;

}

# onkey "4" {
#     paf_anim_ledgegrab; }
