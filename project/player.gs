%include includes/sprite.gs
%include gfx/ply/hal/frame-numbers.gs


costumes 
"gfx/ply/hal/*.png",
;

# start frame values


var SPRITE_NAME = "Player";

proc nothing{
}

onflag{
    sort_depth false, false;
    nothing;
}