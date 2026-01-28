%define bb_hal_stand BoundingBox {centre_x: 0, centre_y: -4, diameter_x: 14, diameter_y: 16}
%define bb_paf_stand BoundingBox {centre_x: 0, centre_y: -4, diameter_x: 10, diameter_y: 16}
%define bb_paf_grab_1  BoundingBox {centre_x: 6 * sign_of(this_direction), centre_y:  2, diameter_x: 2,  diameter_y: 12}
%define bb_paf_grab_2  BoundingBox {centre_x: 6 * sign_of(this_direction), centre_y:  9, diameter_x: 2,  diameter_y: 1}

enum PuffType {
    Side = "side",
    Up  = "up",
    Down = "down",
}
proc hal_side_light {
    # halli: puff stalls momentum
    if yvel.v1 < 0 {
        yvel.v1 = 0;
    }
    puff_timer.current = hal_puff_cooldown;
    direction_lock.current = hal_puff_cooldown * 0.5;
    add Projectile{
        type: "puff",
        name: "puff_halli_side_light",
        lifetime: round(hal_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position + 16 * sign_of(this_direction),
        y_position: y_position,
        xvel: xvel.v1 + max_run * sign_of(this_direction),
        yvel: 0
    } to projectile_queue;
    puff_type = PuffType.Side;
    
}

proc hal_up_light {
    # halli: puff stalls momentum
    if yvel.v1 < 0 {
        yvel.v1 = 0;
    }
    puff_timer.current = hal_puff_cooldown;
    direction_lock.current = hal_puff_cooldown * 0.5;
    add Projectile{
        type: "puff",
        name: "puff_halli_up_light",
        lifetime: round(hal_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position + 4 * sign_of (this_direction),
        y_position: y_position + 12,
        xvel: xvel.v1,
        yvel: yvel.v1 + jump_vel_smal,
    } to projectile_queue;

    puff_type = PuffType.Up;
}

proc hal_down_air {
    # halli: puff stalls momentum (down air is the same as the others)
    if yvel.v1 < 0 {
        yvel.v1 = 0;
    }
    puff_timer.current = hal_puff_cooldown;
    direction_lock.current = hal_puff_cooldown * 0.5;
    add Projectile{
        type: "puff",
        name: "puff_halli_down_air",
        lifetime: round(hal_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position + 8 * sign_of (this_direction),
        y_position: y_position - 12,
        xvel: xvel.v1,
        yvel: yvel.v1 - max_fall * 0.5,
    } to projectile_queue;

    puff_type = PuffType.Down;
}

proc paf_side_light {
    puff_timer.current = paf_puff_cooldown;
    direction_lock.current = paf_puff_cooldown * 0.25;
    add Projectile{
        type: "puff",
        name: "puff_pafu_side_light",
        lifetime: round(paf_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position + 16 * sign_of(this_direction),
        y_position: y_position,
        xvel: paf_run * sign_of(this_direction),
        yvel: 0
    } to projectile_queue;

    puff_type = PuffType.Side;
}

proc paf_down_air {
    puff_timer.current = paf_puff_cooldown;
    direction_lock.current = paf_puff_cooldown * 0.25;

    add Projectile{
        type: "puff",
        name: "puff_pafu_down_air",
        lifetime: round(paf_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position + 5 * sign_of(this_direction),
        y_position: y_position - 12,
        xvel: paf_walk * sign_of(this_direction),
        yvel: -paf_max_fall,
    } to projectile_queue;
    yvel.v1 = paf_jump_vel * 0.25;
    jump_hold = 0;

    puff_type = PuffType.Down;
}

proc paf_up_light {
    puff_timer.current = paf_puff_cooldown;
    direction_lock.current = paf_puff_cooldown * 0.25;
    add Projectile{
        type: "puff",
        name: "puff_pafu_up_light",
        lifetime: round(paf_puff_cooldown * 0.5),
        direction: this_direction,
        x_position: x_position,
        y_position: y_position + 12,
        xvel: 0,
        yvel: paf_jump_vel + max(yvel.v1 * 0.5, 0),
    } to projectile_queue;

    puff_type = PuffType.Up;
}