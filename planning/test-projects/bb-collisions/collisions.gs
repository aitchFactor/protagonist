var SPRITE_NAME = "undefined";
costumes "256x256.png", "2x2.png";
# func get_colliding() Solid{
#     # return the struct entry of the first colliding solid.
#     # this means that any sprite can mark itself as a Solid, although we cannot detect properties of individual clones of a sprite.
#     local i = 0;
#     repeat length Solids {
#         i++;
#         add CollisionCheck {sprite: SPRITE_NAME, costume: costume_name(), touching: Solids[i].raw_name} to collision_checks;
#         if touching(Solids[i].raw_name){
#             return Solids[i];
#         }
#     }
#     return Solid{};
# }
var bb_x;
var bb_y;

proc set_bounding_box x, y {

    bb_x = $x;
    bb_y = $y;
}

func bb_touching (sprite) {

    local last_x = x_position();
    local last_y = y_position();
    local last_costume = costume_number();
    local last_size = size();
    switch_costume "256x256";
    set_size 100;
    set_size 1;
    switch_costume "2x2";
    ############################

    local res =_bb_trace (last_x, last_y, $sprite, true);

    ############################
    goto last_x, last_y;
    switch_costume last_costume;
    set_size last_size;
    return res;

} 

%define trace_tile_size_x 8
%define trace_tile_size_y trace_tile_size_x
func _bb_trace (last_x, last_y, thing, pen = false) {
    # don't use this on its own.

    #   1 -- 2
    #   |    |
    #   3 -- 4
    if $pen {
        erase_all;
    }
    local range_j = ceil(bb_y / trace_tile_size_y);
    local j = (-range_j * 0.5) + 1;
    repeat range_j - 1{
        set_y $last_y + j * trace_tile_size_y;
        if _bb_trace_x ($last_x, $thing, $pen) {
            return true;
        }
        j++;
    }
    j = -1;
    repeat 2 {
        set_y $last_y + bb_y * 0.5 * j;
        if _bb_trace_x ($last_x, $thing, $pen) {
            return true;
        }
        j += 2;
    }
 

}

func _bb_trace_x (last_x, thing, pen = false) {
    local range_i = ceil(bb_x / trace_tile_size_x);
    local i = (-range_i * 0.5) + 1;
    repeat range_i - 1 {

        set_x $last_x + i * trace_tile_size_x;
        
        if $pen {
            set_size 50;
            stamp;
            switch_costume "256x256";
            set_size 100;
            set_size 1;
            switch_costume "2x2";
        }
        if touching ($thing) {
            return true;
        }

        i++;

    }
    i = -1;
    repeat 2 {
        set_x $last_x - bb_x * 0.5 * i;
        if $pen {
            set_size 50;
            stamp;
            switch_costume "256x256";
            set_size 100;
            set_size 1;
            switch_costume "2x2";
        }
        if touching ($thing) {
            return true;
        }
        i += 2;
    }
}

onflag {
    switch_costume "2x2";
    set_bounding_box 32, 48;
    thing = bb_touching("");
}