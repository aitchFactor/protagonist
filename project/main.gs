%include includes/sprite-engine.gs
%include includes/utils.gs
%include includes/defines.gs
# This is a sprite.
costumes "blank.png";


# when green flag clicked
onflag {
  boot;
  forever{
    loop;
  }
}

nowarp proc boot {
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

  delete checkpoints;
  current_checkpoint_index = 0;

  if debug {
    show fps;
  }

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

  # camera_x and camera_y should always be integer.
  camera_x = 0;
  camera_subpixel_x = 0;
  camera_y = 0;
  camera_subpixel_y = 0;
  camera_target_x = 0;
  camera_target_y = 0;
  camera_target_y_max  = 0;
  camera_target_y_min  = 0;

  paused = 0;

  area_transition_direction = "";

  delete player_events;

  # broadcast_and_wait "configure";

  broadcast_and_wait "boot";
  broadcast_and_wait "tick_zsort";
  # checkpoints
  broadcast "load_map_001";
  # player position
  broadcast "load_map_002";
  # map section (taken from player position)
  broadcast "reload_map";
  # level segments
  broadcast_and_wait "load_map_003";
  G_game_state = "play";

  broadcast_and_wait "set_debug_options";

  broadcast "mus_kirb";

}

proc calculate_fps {
    delete fps_list[10];
    insert timer() at fps_list[1];
    reset_timer;
    fps = 0;
    local i = 1;
    repeat length fps_list {
      fps += fps_list[i];
      i++;
    }
    fps = 10 / fps;
}

list fps_list;
onflag {
  forever {
    calculate_fps;
  }
}

nowarp proc loop {

  broadcast "tick_debug_first";
  broadcast "tick_readinput";
  if not paused or key_pressed ("9"){
    if G_game_state == "play"{
      play_tick;
    }
    if G_game_state == "area_transition" {
      area_transition_tick;
    }
    if G_game_state == "level_end" {
      level_end_tick;
    }

    broadcast "tick_cosmetics";     # animation timing, decorative effects
    broadcast "tick_animation";     # execute animation player
    broadcast "tick_display";       # set positional offsets, scrolling. and scale
    broadcast "tick_hitbox_view";

    delete z_positions;
    broadcast "tick_zsort";         # execution order of sprites/clones for other broadcasts is undefined, so be careful.

    broadcast "tick_sound_logic";   # parse audio queues
    broadcast "tick_sound_play";    # play audio queues
  }

  broadcast "tick_check_pause";



  if paused and debug_frame_advance {
    until not key_pressed ("9"){};
  }

  broadcast "tick_debug_last";
}

on "tick_000"{
  
  delete Solids;

  if hitbox_view {
    erase_all;
  }
}


var _transition_status;
%define ts _transition_status
var Timer _transition_timer;
%define tt _transition_timer
%define transition_duration 15
%include gfx/bg/step3/data.gs
nowarp proc area_transition_tick {
  if ts == 0 {
    broadcast_and_wait "level_fadeout";
    tt.current = transition_duration;
    ts ++;
  }

  if ts == 2 {
    broadcast_and_wait "level_fadein";
    G_game_state = "play";
    area_transition_direction = "";
    ts = 0;
  }
  if ts == 1 {
    tt = decrement_timer(tt);

    local delta = ceil(transition_duration / delta_time);

    if area_transition_direction == Direction.Up {
      camera_y +=  visible_height / delta;
    }
    if area_transition_direction == Direction.Right {
      camera_x += visible_width / delta;
    }
    if area_transition_direction == Direction.Down {
      camera_y -= visible_height / delta;
    }
    if area_transition_direction == Direction.Left {
      camera_x -= visible_width / delta;
    }


    if timer_boundary_crossed(tt) {
      # TODO: generalise
      broadcast "reload_map";
      broadcast "solve_segments";
      ts++;
    }
    broadcast "tick_303";
  }

}

nowarp proc play_tick {
    ### restore game state to backend mode (scale, subpixels, hitbox modes)
    broadcast "tick_000";

    ### solids ticks (collisions with actors)
    broadcast "tick_001";
    broadcast "tick_002";
    broadcast "tick_008";

    ### actor tick (collisions with solids)
    broadcast "tick_101";
    broadcast "tick_102";
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

nowarp proc level_end_tick {
  broadcast "tick_000";
  broadcast "tick_level_end";
  broadcast "tick_108";
  broadcast "tick_301";
  # broadcast "tick_302";
  # broadcast "tick_303";
}













onkey "g" {
  if debug {
    broadcast "switch_player";
  }
}

onkey "h" {
  if debug {
    hitbox_view = not hitbox_view;
    erase_all;
  }
}

onkey "b" {
  if debug {
    show_scroll_target = not show_scroll_target;
  }
}

onkey "f" {
  if debug {
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
}

onkey "c" {
  if debug {
    debug_show_checkpoints = not debug_show_checkpoints;
  }
}

on "tick_check_pause" {
  if debug_frame_advance and key_pressed ("9"){
    paused = true;
  }
  if ctrl_start == 1 {
    paused = not paused;
  }

}


onkey "v" {
  if key_pressed ("shift") {
    broadcast "player_respawn_big";
  }
  else {
    broadcast "player_respawn_small";
  }
}

on "tick_000"{
  delete collision_checks;
  delete collision_colour_checks;
}
