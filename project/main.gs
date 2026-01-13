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

  delete projectile_queue;

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

  camera_x = 0;
  camera_y = 0;
  camera_target_x = 0;
  camera_target_y = 0;

  broadcast_and_wait "boot";
  G_game_state = "play";

  broadcast_and_wait "set_debug_options";

}

proc loop {

  broadcast "tick_debug_first";
  broadcast "tick_readinput";
  if G_game_state == "play"{
    ### restore game state to backend mode (scale, subpixels, hitbox modes)
    broadcast "tick_000";

    ### solids ticks (collisions with actors)
    broadcast "tick_001";
    broadcast "tick_002";
    broadcast "tick_008";

    ### actor tick (collisions with solids)
    broadcast "tick_101";
    broadcast "tick_108";
    
    ### post actor ticks: resolve actor-to-actor collisions
    broadcast "tick_201";
    broadcast "tick_202";
    broadcast "tick_203";

    ### after all actors have moved, move the camera
    broadcast "tick_301";
    broadcast "tick_302";
    broadcast "tick_303";
  }

  broadcast "tick_cosmetics";     # animation timing, decorative effects
  broadcast "tick_animation";     # execute animation player
  broadcast "tick_display";       # set positional offsets, scrolling. and scale
  broadcast "tick_hitbox_view";

  broadcast "tick_zsort";         # execution order of sprites/clones for other broadcasts is undefined, so be careful.

  broadcast "tick_sound_logic";   # parse audio queues
  broadcast "tick_sound_play";    # play audio queues

  broadcast "tick_check_pause";

  broadcast "tick_debug_last";
}

on "tick_000"{
  delete Solids;
}

on "tick_zsort"{
  delete z_positions;
  sort_depth "-Infinity", false;
}

onkey "g" {
  player = ((player) % 2) + 1; 
}

onkey "h" {
  hitbox_view = not hitbox_view;
}

onkey "b" {
  show_scroll_target = not show_scroll_target;
}

onkey "f" {
  fps_switch = (fps_switch + 1) % 4;
  if fps_switch == 0 { # 30hz
    delta_time = 2;
  }
  if fps_switch == 1 { # 60hz
    delta_time = 1;
  }
  if fps_switch == 2 { # 165hz
    delta_time = 60/165; 
  }
  if fps_switch == 3 { # 20hz
    delta_time = 3;
  }
}