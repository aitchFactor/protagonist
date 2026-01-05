%define PI_YAY 3.14159265358979323

# This is a sprite.
costumes "blank.png";


# when green flag clicked
onflag {
  broadcast "tick_001";
  broadcast "tick_002";
  broadcast "tick_display_scale";
}
