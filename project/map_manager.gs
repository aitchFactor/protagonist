costumes "blank.png";

%include gfx/bg/step3/data.gs
%include includes/utils.gs

proc reload_map {
    # for when the level must transition immediately.

    if map_info.map_name == "step3" {
        map_info = step3_atlas(x_to_chunk("player"."x_position"), y_to_chunk("player"."y_position"));
    }
    broadcast "map_reloaded";

}

on "reload_map" {
    reload_map;
}