# anything that is collidable.
%include includes/obj.gs
var SPRITE_NAME = "Unnamed Solid";

proc solid_tick{
    add Solid {raw_name: SPRITE_NAME, clone_name: SPRITE_NAME & " " & clone_id} to Solids;
}

on "tick_008"{
    solid_tick;
}
