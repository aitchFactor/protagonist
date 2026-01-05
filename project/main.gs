%include includes/sprite-engine.gs
# This is a sprite.
costumes "blank.png";


# when green flag clicked
onflag {

}

proc init {


}

proc loop {
  broadcast "tick_debug_first";
  broadcast "tick_readinput";

  ### restore game state to internal mode (scale, subpixels, hitbox modes)
  broadcast "tick_000";

  ### pre-player ticks: moving platforms, moving hazards (projectiles?)
  broadcast "tick_001";
  broadcast "tick_002";
  broadcast "tick_003";

  ### player tick
  broadcast "tick_101";
  
  ### post player ticks: enemies getting stomped etc
  broadcast "tick_201";
  broadcast "tick_202";
  broadcast "tick_203";

  broadcast "tick_cosmetics";
  broadcast "tick_display";       # set positional offsets, scrolling. animation frames and scale
  broadcast "tick_zsort";         # execution order of sprites/clones for other broadcasts is undefined, so be careful.

  broadcast "tick_sound_logic";   # parse audio queues
  broadcast "tick_sound_play";    # platy audio queues

  broadcast "tick_check_pause";

  broadcast "tick_debug_last";
}

