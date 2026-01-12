# anything that is collidable.
%include includes/obj.gs
var SPRITE_NAME = "Unnamed Solid";

var Solid properties;


proc init_properties {
    properties = Solid 
        {raw_name: SPRITE_NAME, clone_name: SPRITE_NAME & " " & clone_id};
}
proc solid_tick{
    if clone_id == BgLayerType.None or clone_id == BgLayerType.Picture {
        stop_this_script;
    }

    add properties to Solids;
}

on "boot"{
    init_properties;
}

on "tick_008"{
    solid_tick;
}
