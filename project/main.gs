%include includes/sprite-engine.gs
# This is a sprite.
costumes "blank.png";


# when green flag clicked
onflag {
  boot;
  forever{
    loop;
  }
}

proc boot {
  G_game_state = "boot";
  fps = 0;

  delete z_positions;
  delete input;

  delete mus_queue;
  delete sfx_queue;

  delete hitboxes;
  delete hurtboxes;

  delete Solids;

  broadcast_and_wait "boot";

}

proc loop {
  broadcast "tick_debug_first";
  broadcast "tick_readinput";

  ### restore game state to backend mode (scale, subpixels, hitbox modes)
  broadcast "tick_000";

  ### solids ticks (collisions with actors)
  broadcast "tick_001";
  broadcast "tick_002";
  broadcast "tick_003"; 

  ### actor tick (collisions with solids)
  broadcast "tick_101";
  broadcast "tick_108";
  
  ### post actor ticks: resolve actor-to-actor collisions
  broadcast "tick_201";
  broadcast "tick_202";
  broadcast "tick_203";

  broadcast "tick_cosmetics";     # animation, decorative effects
  broadcast "tick_display";       # set positional offsets, scrolling. and scale
  broadcast "tick_zsort";         # execution order of sprites/clones for other broadcasts is undefined, so be careful.

  broadcast "tick_sound_logic";   # parse audio queues
  broadcast "tick_sound_play";    # play audio queues

  broadcast "tick_check_pause";

  broadcast "tick_debug_last";
}

