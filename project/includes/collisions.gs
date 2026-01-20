var SPRITE_NAME = "undefined";
costumes "gfx/256x256.png", "gfx/2x2.png";
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

struct BoundingBox {
    centre_x = 0,
    centre_y = 0,
    diameter_x,
    diameter_y
}
var BoundingBox bounding_box;
# In fast mode, only the edges of the bounding box will be checked.
var fast_collisions;

on "boot" {
    fast_collisions = false;
}

var Solid get_colliding_type_local;
func get_colliding_type() {
    # Check the type by the colour of the detected collision.
    # Each type's priority is implemented here.

    # get_colliding_type_local = get_colliding();

    # if get_colliding_type_local.raw_name == "" {
    #     return BgLayerType.None;
    # }
    if bb_touching(BgLayerTypeColour.Solid) {
        return BgLayerType.Solid;
    }
    if bb_touching(BgLayerTypeColour.Soft) {
        return BgLayerType.Soft;
    }
    # Picture should be the lowest priority.

    if bb_touching(BgLayerTypeColour.Picture) {
        return BgLayerType.Picture;
    }

    return BgLayerType.None;
}

func get_colliding_types() {
    # Get the collision of all layers in a ?-bit integer.
    # But just remember, each pixel can currently only be of one layer type.
    local res = 0;
    # get_colliding_type_local = get_colliding();

    # if get_colliding_type_local.raw_name == "" {
    #     return 0;
    # }
    if bb_touching(BgLayerTypeColour.Solid) {
        res += BgLayerTypeBit.Solid;
    }
    if bb_touching(BgLayerTypeColour.Soft) {
        res += BgLayerTypeBit.Soft;
    }

    if bb_touching(BgLayerTypeColour.Spike) {
        res += BgLayerTypeBit.Spike;
    }
    if bb_touching(BgLayerTypeColour.Pogo) {
        res += BgLayerTypeBit.Pogo;
    }
    # Picture should be the lowest priority.
    # if touching_color(BgLayerTypeColour.Picture) {
    #     res += 
    # }

    return res;
}

func is_colliding_solid(axis, sign){
    
    local last_costume = costume_number();
    # solve for the lowest pixel row of the current bounding box.
    local BoundingBox last = bounding_box;

    bounding_box = BoundingBox {
        centre_x: bounding_box.centre_x,
        diameter_x: bounding_box.diameter_x,
        centre_y: bounding_box.centre_y - bounding_box.diameter_y/2,
        diameter_y: 0};

    # If not overlapping a soft platform, reset the variable.

    local collisions = get_colliding_types();
    bounding_box = last;
    
    touching_soft = floor(collisions / BgLayerTypeBit.Soft) % 2;

    # if going down, not overlapping last frame, and touching now
    if ($axis == "y" and $sign == -1) and (not inside_soft) and touching_soft {
        return true;
    }

    inside_soft = touching_soft;

    if bitmask(collisions, BgLayerTypeBit.Solid) {
        return true;
    }

    if get_colliding_type() == BgLayerType.Solid{
        return true;
    }
    return false;
}

proc set_bounding_box BoundingBox box {
    # sets the size of the bounding box for this collider to some dimensions
    # centred on the sprite. 
    bounding_box.diameter_x = $box.diameter_x;
    bounding_box.diameter_y = $box.diameter_y;
    bounding_box.centre_x = $box.centre_x;
    bounding_box.centre_y = $box.centre_y;
}

func bb_touching (sprite, pen = false) {

    local last_x = x_position();
    local last_y = y_position();
    local last_costume = costume_number();
    local last_size = size();
    switch_costume "256x256";
    set_size 100;
    set_size 1;
    switch_costume "2x2";
    ############################

    local res =_bb_trace (last_x, last_y, $sprite, $pen);

    ############################
    goto last_x, last_y;
    switch_costume last_costume;
    set_size last_size;
    return res;

} 

%define trace_tile_size_x 8
%define trace_tile_size_y trace_tile_size_x
func _bb_trace (last_x, last_y, thing, pen = true) {
    # don't use this on its own.

    #   1 -- 2
    #   |    |
    #   3 -- 4
    local range_j = ceil(bounding_box.diameter_y / trace_tile_size_y);
    local j = (-range_j * 0.5) + 1;
    repeat range_j - 1{
        set_y $last_y + bounding_box.centre_y + j * trace_tile_size_y;
        if _bb_trace_x ($last_x, $thing, not fast_collisions, $pen) {
            return true;
        }
        j++;
    }
    j = -1;
    repeat 2 {
        set_y $last_y + bounding_box.centre_y + bounding_box.diameter_y * 0.5 * j;
        if _bb_trace_x ($last_x, $thing, true, $pen) {
            return true;
        }
        j += 2;
    }
    
    return false;

}

func _bb_trace_x (last_x, thing, full, pen = false) {
    local range_i = ceil((bounding_box.diameter_x) / trace_tile_size_x);
    local i = (-range_i * 0.5) + 1;
    if $full {
        repeat range_i - 1 {

            set_x $last_x + bounding_box.centre_x + i * trace_tile_size_x;
            
            if $pen {
                set_size 50;
                stamp;
                switch_costume "256x256";
                set_size 100;
                set_size 1;
                switch_costume "2x2";
            }

            add CollisionCheck {sprite: SPRITE_NAME, touching: $thing, costume: costume_name()} to collision_checks;
            if $thing[1] & $thing[2] == "0x" {
                if touching_color ($thing) {
                    return true;
                }
            }
            else {
                if touching ($thing) {
                    return true;
                }
            }

            i++;

        }
    }
    i = -1;
    repeat 2 {
        set_x $last_x + bounding_box.centre_x - bounding_box.diameter_x * 0.5 * i;
        if $pen {
            set_size 50;
            stamp;
            switch_costume "256x256";
            set_size 100;
            set_size 1;
            switch_costume "2x2";
        }
        add CollisionCheck {sprite: SPRITE_NAME, touching: $thing, costume: costume_name()} to collision_checks;
        if $thing[1] & $thing[2] == "0x" {
            if touching_color ($thing) {
                return true;
            }
        }
        else {
            if touching ($thing) {
                return true;
            }
        }
        i += 2;
    }

    return false;
}

on "tick_hitbox_view" {
    if hitbox_view {
        if bb_touching("", true) {
            # intentionally left blank.
        }
    }
}