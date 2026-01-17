func get_colliding() Solid{
    # return the struct entry of the first colliding solid.
    # this means that any sprite can mark itself as a Solid, although we cannot detect properties of individual clones of a sprite.
    local i = 0;
    repeat length Solids {
        i++;
        if touching(Solids[i].raw_name){
            return Solids[i];
        }
    }
    return Solid{};
}

var Solid get_colliding_type_local;
func get_colliding_type() {
    # Check the type by the colour of the detected collision.
    # Each type's priority is implemented here.

    get_colliding_type_local = get_colliding();

    if get_colliding_type_local.raw_name == "" {
        return BgLayerType.None;
    }
    if touching_color(BgLayerTypeColour.Solid) {
        return BgLayerType.Solid;
    }
    if touching_color(BgLayerTypeColour.Soft) {
        return BgLayerType.Soft;
    }
    # Picture should be the lowest priority.
    if touching_color(BgLayerTypeColour.Picture) {
        return BgLayerType.Picture;
    }

    return BgLayerType.None;
}

func get_colliding_types() {
    # Get the collision of all layers in a ?-bit integer.
    # But just remember, each pixel can currently only be of one layer type.
    local res = 0;
    get_colliding_type_local = get_colliding();

    if get_colliding_type_local.raw_name == "" {
        return 0;
    }
    if touching_color(BgLayerTypeColour.Solid) {
        res += BgLayerTypeBit.Solid;
    }
    if touching_color(BgLayerTypeColour.Soft) {
        res += BgLayerTypeBit.Soft;
    }

    if touching_color(BgLayerTypeColour.Spike) {
        res += BgLayerTypeBit.Spike;
    }

    if touching_color(BgLayerTypeColour.Pogo) {
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
    # try to switch to the soft variant of the current hitbox costume, if there is one
    switch_costume costume_name() & "-soft";

    # If not overlapping a soft platform, reset the variable.

    local collisions = get_colliding_types();
    switch_costume last_costume;
    touching_soft = floor(collisions / BgLayerTypeBit.Soft) % 2;

    # if going down, not overlapping last frame, and touching now
    if ($axis == "y" and $sign == -1) and (not inside_soft) and touching_soft {
        return true;
    }

    inside_soft = touching_soft;

    if get_colliding_type() == BgLayerType.Solid{
        return true;
    }
    return false;
}
