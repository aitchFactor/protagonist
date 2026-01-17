# note: don't include comments in the same line as a macro
#20/16
%define max_walk    317/256

%define max_run    573/256
#384/65536
%define accel_walk  1.5/16
%define accel_run  1.5/16
%define paf_accel_walk  0;
#-256/65536
%define decel_still 0.0625  
#-640/65536
%define decel_walk  2.5/16

%define decel_run  5/16

%define fall_gravity 6/16

%define jump_gravity 3/16

%define max_fall 4

%define jump_vel 5

%define hal_pogo_vel 4

%define jump_vel_smal sqrt(12)

%define jump_incr  (2/16)

%define spin_jump_vel (74/16)

# pafu's parameters

%define paf_gravity (8/49)

# same height as halli's standing jump height.
%define paf_jump_vel (100/21) 

# estimate
%define paf_jump_vel_smal paf_gravity

# halfway between mario's walk and run speeds (not based on hollow knight)
%define paf_walk 1.6

# mario's p-speed 
%define paf_run 3.18

%define paf_decel paf_run/20
# blind guess
%define paf_max_fall 5

%define paf_skid_threshold 2

%define hal_puff_cooldown 24

%define paf_puff_cooldown 29