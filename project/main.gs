%define PI_YAY 3.14159265358979323

# This is a sprite.
costumes "blank.png";


# when green flag clicked
onflag {

}

proc init {


}

proc loop {
  broadcast "tick_debug0";
  broadcast "tick_zsort";
  broadcast "tick_readinput";
  broadcast "tick_001";
  broadcast "tick_002";
  broadcast "tick_display_scale";
}