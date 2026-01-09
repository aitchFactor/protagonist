%include includes/solid.gs
costumes 
"gfx/bg/collision/*.png",
;
var SPRITE_NAME = "Level";

on "tick_000"{
    switch_costume "undergrowth_v00_collision";
}
on "tick_display"{
    switch_costume "undergrowth_v00";
}