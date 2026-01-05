%include includes/sprite-engine.gs
### Scripts - sprites importing this file will contain this script.
var clone_id = "root"

on "tick_zsort" {
    sort_depth z_position, false;
}