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
  delta_time = 2; # 30fps

  delete z_positions;
  delete input;

  delete mus_queue;
  delete sfx_queue;

  delete hitboxes;
  delete hurtboxes;

  delete Solids;

  ctrl_up = 0;
  ctrl_down = 0;
  ctrl_left = 0;
  ctrl_right = 0;
  ctrl_a = 0;
  ctrl_b = 0;
  ctrl_x = 0;
  ctrl_y = 0;
  ctrl_sl = 0;
  ctrl_sr = 0;
  ctrl_start = 0;

  broadcast_and_wait "boot";

}

proc loop {
  broadcast "tick_debug_first";
  broadcast "tick_readinput";

  repeat delta_time{
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
  }

  broadcast "tick_zsort";         # execution order of sprites/clones for other broadcasts is undefined, so be careful.

  broadcast "tick_sound_logic";   # parse audio queues
  broadcast "tick_sound_play";    # play audio queues

  broadcast "tick_check_pause";

  broadcast "tick_debug_last";
}

