%include includes/actor.gs
%include gfx/ply/attributes.gs

costumes "gfx/ply/smoke-puff*.png/",
"gfx/2x16.png",
"gfx/2x2.png",
"gfx/ply/pogo.png";

var SPRITE_NAME = "Puff Projectile";


var Projectile self;

on "boot" {
    lifetime = 0;
    self = Projectile {};
    z_position = 256;
    hide;
}

proc anim_side_light duration = 25 {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "smoke-puff_1",      duration: $duration - 5,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff_2",      duration: 1,    flip: false } to animations_queue_frames;
    set_rotation_style_left_right;
    # switch_costume "smoke-puff_1";
}

proc hal_side_light duration = 25 {
    clear_animation;
    add AnimationHeader {
        num_pages: 3,
        loop_start: 2,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "smoke-puff_1",      duration: 2,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff-thin_1",      duration:  $duration - 4,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff-thin_2",      duration: 1,    flip: false } to animations_queue_frames;
    set_rotation_style_left_right;
    # switch_costume "smoke-puff_1";
}

proc paf_side_light duration = 30 {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "smoke-puff-wide_1",      duration: $duration - 5,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff-wide_2",      duration: 1,    flip: false } to animations_queue_frames;
    set_rotation_style_left_right;
    # switch_costume "smoke-puff_1";
}

proc paf_down_air duration = 30 {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "smoke-puff-wide-down_1",      duration: $duration - 5,    flip: true } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff-wide-down_2",      duration: 1,    flip: true } to animations_queue_frames;
    set_rotation_style_left_right;
    last_hurtbox = "2x16";
    # switch_costume "smoke-puff_1";
}

proc paf_up_light duration = 30 {
    clear_animation;
    add AnimationHeader {
        num_pages: 2,
        loop_start: 1,
        loops: -1
    }   to animations_queue_header;
    add AnimationFrame {costume_name: "smoke-puff-wide-up_1",      duration: $duration - 5,    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff-wide-up_2",      duration: 1,    flip: false } to animations_queue_frames;
    set_rotation_style_left_right;
    # switch_costume "smoke-puff_1";
}

proc receive_projectile {
    # TODO: call multiple times for multiple puffs
    # for loop cause index matching on struct lists seems broken/unimplemented
    local index = 0;
    repeat length projectile_queue{
        index ++;
        if projectile_queue[index].type != "" {
            Projectile new_puff = projectile_queue[index];
            delete projectile_queue[index];
            self = new_puff;
            clone_id = self.name;
            clone;
        }
    }
    clone_id = "root";
    self = Projectile{};
}

on "tick_201"{
    if clone_id == "root" {
        receive_projectile;
    }



}

onclone {
    this_direction = self.direction;
    x_position = self.x_position;
    y_position = self.y_position;
    xvel.v1 = self.xvel;
    yvel.v1 = self.yvel;
    last_hurtbox = "2x2";
    # follow does nothing at the moment.

    if clone_id == "puff_halli_side_light"{
        SPRITE_NAME = "Halli Puff SLight";
        hal_side_light self.lifetime;

    }
    if clone_id == "puff_pafu_side_light"{
        SPRITE_NAME = "Pafu Puff SLight";
        paf_side_light self.lifetime;

    }
    if clone_id == "puff_pafu_down_air"{
        SPRITE_NAME = "Pafu Puff DAir";
        paf_down_air self.lifetime;

    }
    if clone_id == "puff_pafu_up_light"{
        SPRITE_NAME = "Pafu Puff ULight";
        paf_up_light self.lifetime;

    }
    animation_player;
    sprite_display;
    show;
}

on "tick_000"{
    if clone_id != "root" {
        self.lifetime -= delta_time;

        if self.lifetime <= 0 {
            delete_this_clone;
        }
    }
}

on "tick_101"{
    if clone_id != "root" {
        if clone_id == "puff_halli_side_light"{
            xvel = decelerate_advanced(xvel.v1, 5/16, xvel.a, 1/16);
            yvel = decelerate_advanced(yvel.v1, 5/16, yvel.a, 1/16);

        }
        if clone_id == "puff_pafu_side_light"{
            xvel = decelerate_advanced(xvel.v1, 3/16, xvel.a, paf_walk);
            yvel = accelerate_advanced(yvel.v1, paf_gravity * 0.5, yvel.a, 3/16);

        }
        if clone_id == "puff_pafu_down_air"{
            xvel = accelerate_advanced(xvel.v1, -6/32 * sign_of(this_direction), xvel.a);
            yvel = accelerate_advanced(yvel.v1, 7/16, yvel.a, paf_jump_vel_smal);



        }
        if clone_id == "puff_pafu_up_light"{
            # xvel = accelerate_advanced(xvel.v1, -7/32 * sign_of(this_direction), xvel.a);
            yvel = decelerate_advanced(yvel.v1, paf_gravity * 2.5, yvel.a, paf_jump_vel_smal);

        }
        switch_costume last_hurtbox;
        speedcaps;
        move_x xvel.dx, CollideAction.Nothing;
        move_y yvel.dx, CollideAction.Nothing;

        if "down_air" in clone_id {
            check_pogo;
        }
    }
}

proc check_pogo {
    last_costume = costume_number();
    switch_costume "pogo";
    if bitmask (get_colliding_types(), BgLayerTypeBit.Pogo) {
        add PlayerEvent {type: "pogo", name: "", sender: SPRITE_NAME} to player_events;
        delete_this_clone;
    }
    switch_costume last_costume;
}

# on "tick_008" {
#     if clone_id != "root"{
#         if self.follow != "" {
#             goto self.x_position + x_position + x_scroll + self.follow."x position", self.y_position + y_position + y_scroll + self.follow."y position";
#         }
#     }
# }

# proc puff_tick_display {
#     x_position = round_256(x_position() - x_scroll);
#     y_position = round_256(y_position() - y_scroll);
#     self.x_position = round_256(self.x_position);
#     self.y_position = round_256(self.y_position);
#     x_scroll = round_256(x_scroll);
#     y_scroll = round_256(y_scroll);

#     point_in_direction this_direction * (-bool_to_sign(flipped));


#     set_size 800;
#     goto round(self.x_position + x_position + x_scroll + self.follow."x position") * 2, round(self.y_position + y_position + y_scroll + self.follow."y position") * 2;
#     set_size 200;
# }


on "tick_cosmetics" {
    if clone_id != "root" {
        animation_counter += delta_time;
    }
}   

# on "tick_display" {
#     puff_tick_display;
# }
