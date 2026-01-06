%include includes/actor.gs
%include gfx/ply/hal/costume-names.gs



costumes 
"gfx/ply/hitbox/stand.png" as "hbox_stand",
"gfx/ply/hitbox/crouch.png" as "hbox_crouch",
"gfx/ply/hal/*.png",
;

# start frame values


var SPRITE_NAME = "Player";

proc boot{
    switch_costume FR_STAND;
    last_hurtbox = "hbox_stand";

}
onflag{
    sort_depth false, false;
}

on "boot"{
    boot;
}


#idea: pack tile info into "touching colour" block