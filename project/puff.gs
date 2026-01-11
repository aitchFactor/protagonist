%include includes/actor.gs

costumes "gfx/ply/smoke-puff_*.png/";

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
    add AnimationFrame {costume_name: "smoke-puff_1",      duration: $duration - round(2.4 / delta_time),    flip: false } to animations_queue_frames;
    add AnimationFrame {costume_name: "smoke-puff_2",      duration: 1,    flip: false } to animations_queue_frames;
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
    if clone_id == "puff_halli_side_light"{
        SPRITE_NAME = "Puff SLight";
        anim_side_light self.lifetime;

    }
    animation_player;
    puff_tick_display;
    show;
}

on "tick_000"{
    if clone_id != "root" {
        self.lifetime -= 1;

        if self.lifetime <= 0 {
            delete_this_clone;
        }
    }
}

on "tick_101"{
    if clone_id != "root" {
        if clone_id == "puff_halli_side_light"{
            xvel = decelerate_advanced(self.xvel, 5/16, xvel.a, 1/16);
            yvel = decelerate_advanced(self.yvel, 5/16, yvel.a, 1/16);
            self.x_position += xvel.dx;
            self.y_position += yvel.dx;
            self.xvel = xvel.v1;
            self.yvel = yvel.v1;

            # reset struct variables
            xvel = ContinuousVelocity{};
            yvel = ContinuousVelocity{};

        }
    }
}

on "tick_008" {
    if clone_id != "root"{
        if self.follow != "" {
            goto self.x_position + x_position + x_scroll + self.follow."x position", self.y_position + y_position + y_scroll + self.follow."y position";
        }
    }
}

proc puff_tick_display {
    x_position = round_16(x_position() - x_scroll);
    y_position = round_16(y_position() - y_scroll);
    self.x_position = round_16(self.x_position);
    self.y_position = round_16(self.y_position);
    x_scroll = round_16(x_scroll);
    y_scroll = round_16(y_scroll);

    point_in_direction this_direction * (-bool_to_sign(flipped));


    set_size 800;
    goto round(self.x_position + x_position + x_scroll + self.follow."x position") * 2, round(self.y_position + y_position + y_scroll + self.follow."y position") * 2;
    set_size 200;
}


on "tick_cosmetics" {
    if clone_id != "root" {
        animation_counter += 1;
    }
}

on "tick_display" {
    puff_tick_display;
}