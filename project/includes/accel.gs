struct ContinuousVelocity {
    v0 = 0, # velocity at frame start (unused, and editing this should do nothing)
    v1 = 0, # velocity at frame end
    dx = 0, # integrated
    a  = 0, # acceleration (accumulate per frame)
}

var ContinuousVelocity xvel;

var ContinuousVelocity yvel;

func accelerate (vx, ax, accumulated_ax, max = "Infinity") ContinuousVelocity{
    local vx_2 = $vx + $ax;

    if vx_2 * sign_of($max) > abs($max) {
        vx_2 = $max;
    }
    return ContinuousVelocity{v0: $vx, v1: vx_2, dx: vx_2, a: $accumulated_ax + (vx_2 - $vx)};
}

# note about acceleration functions: seems to be a bad idea to use more than one per timestep due to delta time shenanigans
func accelerate_advanced (v, a, accumulated_a, max = "Infinity") ContinuousVelocity {

    
    local saturation_delta_time = delta_time; # initial value means we don't know when velocity will max out.
    local v1 = $v + $a * delta_time;

    if v1 * sign_of($max) > abs($max) {
        v1 = $max;
        saturation_delta_time = (v1 - $v) / $a; 
        # sat<0 -- saturation was reached in the past (slowly decelerate - TODO)
        # sat=0 -- saturation is happening now
        # 0<sat<delta_time -- saturation will occur during this frame
        # sat >= delta_time -- saturation will occur after this frame 
    }


    local t2 = saturation_delta_time;
    local dx = 0;

    if t2 <= 0 {
        dx = v1 * delta_time;
    }
    if t2 > 0 and t2 < delta_time {
        dx = (($v * t2 + (0.5 * $a * t2 * t2) + v1 * (delta_time - t2)));
    }
    else {
        dx = ($v + v1) * 0.5 * delta_time;
    }

    local effective_a = (v1 - $v) / delta_time;

    return ContinuousVelocity{v0: $v, v1: v1, dx: dx, a: $accumulated_a + effective_a};
}

func decelerate_advanced (v, a, accumulated_a, min = 0) ContinuousVelocity{
    # Return a velocity slowed down by some acceleration amount. 
    # The deceleration is always the same sign as the inputted vx.
    # Examples:
    # decelerate (1, -0.5) -> 0.5
    # decelerate (1, 0.5) -> 0.5
    # decelerate (-1, -2, min = -0.3) -> 0.3
    # decelerate (1, -2, min = 0) -> 0 
    local v_ = abs($v);
    local a_ = abs($a);
    local stop_delta_time = delta_time;


    local v1 = v_ - a_ * delta_time;

    if v1 < $min {
        v1 = $min;
        stop_delta_time = (v1 - $v) / a_;
    }

    local t2 = stop_delta_time;
    local dx = 0;

    if t2 <= 0{
        dx = v1 * sign_of($v) * delta_time;
    }

    if t2 > 0 and t2 < delta_time{
        dx = ((v_ * t2 + (0.5 * a_ * t2 * t2) + v1 * (delta_time - t2)) * sign_of($v));
    }
    else {
        dx = (v_ + v1) * 0.5 * sign_of($v) * delta_time;
    }

    local effective_a = (v1 - $v) / delta_time;

    return ContinuousVelocity{v0: $v, v1: v1 * sign_of($v), dx: dx, a: $accumulated_a + effective_a};
}

var ContinuousVelocity accelerate_saturation_vel;
var acceleration_saturation_return_case;
enum AccelerationSaturationCase {
    UnderBounds,
    BoundedAcceleration,
    BoundedDeceleration,
    OverBounds,
}

func accelerate_saturation (acc, v, a1, a2, d1, d2, s = "Infinity", z = 0) ContinuousVelocity {
    # Solve for accelerating and decelerating forces in the direction of some saturation point.
    # v: current velocity.
    # a1: acceleration between the zero point and saturation.
    # a2: acceleration before the zero point.
    # d1: deceleration between saturation and the zero point. (Input as negative to decelerate)
    # d2: deceleration when velocity exceeds saturation.
    # s:  velocity of saturation. The direction of this value relative to zero determines the sign of the others.
    # z:  the zero point. Or you can set it to be not zero, but who knows what might happen. 
    #          |   d1 <-    |    d2 <==
    # -  -- ---z------------s--- -- - > velocity
    # a2 ==>   |   a1 ->    |

    # First, convert all values to signed magnitude in the direction of saturation.
    local sign = sign_of($s - $z);
    local v = $v * sign;
    local a1 = $a1;
    local a2 = $a2;
    local d1 = $d1;
    local d2 = $d2;
    local s = $s * sign;
    local z = $z * sign;

    # case 1: velocity is below zero (accelerate with a2)

    if v < z {
        accelerate_saturation_vel = accelerate_advanced(v, a2, $acc, s);
        acceleration_saturation_return_case = AccelerationSaturationCase.UnderBounds;
    }
    else {
        # case 2: velocity is beyond saturation (decelerate with d2 with saturation as the "minimum")
        if v > s {
            accelerate_saturation_vel = accelerate_advanced(v, d2, $acc, s);
            acceleration_saturation_return_case = AccelerationSaturationCase.OverBounds;
        }
        else {
            # case 3: velocity is between zero and saturation (apply net acceleration between a1 and d1)
            if a1 + d1 >= 0 {
                accelerate_saturation_vel = accelerate_advanced(v, a1 + d1, $acc, s);
                acceleration_saturation_return_case = AccelerationSaturationCase.BoundedAcceleration;
            }
            else {
                accelerate_saturation_vel = accelerate_advanced(v, a1 + d1, $acc, z);
                acceleration_saturation_return_case = AccelerationSaturationCase.BoundedDeceleration;
            }
        }
    }

    # Convert back to the sign of the input.
    return ContinuousVelocity {
        v0: $v,
        v1: accelerate_saturation_vel.v1 * sign,
        dx: accelerate_saturation_vel.dx * sign,
        a:  accelerate_saturation_vel.a * sign
    };

}
