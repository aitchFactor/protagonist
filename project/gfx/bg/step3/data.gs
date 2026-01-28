# note: coordinates are transformed at runtime.
%define step3_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 0,       \
        map_top_edge:  0,       \
        map_right_edge: 16,     \
        map_bottom_edge: 12}    \

%define step3a_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 0,       \
        map_top_edge:  0,       \
        map_right_edge: 8,     \
        map_bottom_edge: 4,}    \

%define step3b_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 2,       \
        map_top_edge:  4,       \
        map_right_edge: 9,     \
        map_bottom_edge: 12,    \
        spawn_checkpoint_index: 4}    \

%define step3c_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 9,       \
        map_top_edge:  5,       \
        map_right_edge: 12,     \
        map_bottom_edge: 12,    \
        spawn_checkpoint_index: 6}    \

# TODO: checkpoint needs to be moved to be inside the section.

%define step3d_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 12,       \
        map_top_edge:  10,       \
        map_right_edge: 16,     \
        map_bottom_edge: 12,    \
        spawn_checkpoint_index: 9}    \

%define step3e_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 9,       \
        map_top_edge:  0,       \
        map_right_edge: 12,     \
        map_bottom_edge: 6,    \
        spawn_checkpoint_index: 2}    \

%define step3f_header MapInfo{   \
        map_name: "step3",      \
        map_left_edge: 12,       \
        map_top_edge:  0,       \
        map_right_edge: 16,     \
        map_bottom_edge: 10,    \
        spawn_checkpoint_index: 3}    \


func step3_atlas (chunk_x, chunk_y) MapInfo {
    if $chunk_x <= 8 {
        if $chunk_y <= 3 {
            return step3a_header;
        }
        else {
            return step3b_header;
        }
    }
    if $chunk_x <= 11 {
        if $chunk_y <= 4 {
            return step3e_header;
        }
        else {
            return step3c_header;
        }
    }
    else {
        if $chunk_y <= 9 {
            return step3f_header;
        }
        else {
            return step3d_header;
        }
    }
        
} 

func get_step3b() MapInfo {
    return step3b_header;
}

# broadcasts are too risky, as these scripts could appear multiple times in many sprites.
# on "step3_atlas" {
#     map_info = step3_atlas(chunk_query_x, chunk_query_y);
# } 

# on "step3_checkpoints" {
#     step3_checkpoints;
# }

proc step3_checkpoints {
    delete checkpoints;
    add Checkpoint {chunk_x: 0, chunk_y: 3,     spawn_x: 112,   spawn_y: 352} to checkpoints;
    add Checkpoint {chunk_x: 6, chunk_y: 1,     spawn_x: 992,   spawn_y: 192} to checkpoints;
    add Checkpoint {chunk_x: 12, chunk_y: 3,     spawn_x: 1648,  spawn_y: 360} to checkpoints;
    add Checkpoint {chunk_x: 6, chunk_y: 5,     spawn_x: 736,   spawn_y: 448} to checkpoints;
    add Checkpoint {chunk_x: 4, chunk_y: 6,     spawn_x: 560,   spawn_y: 752} to checkpoints;
    add Checkpoint {chunk_x: 8, chunk_y: 8,     spawn_x: 1120,  spawn_y: 864} to checkpoints;
    add Checkpoint {chunk_x: 14, chunk_y: 9,     spawn_x: 1856,  spawn_y: 912} to checkpoints;
    add Checkpoint {chunk_x: 3, chunk_y: 9,     spawn_x: 400,   spawn_y: 1040} to checkpoints;
    add Checkpoint {chunk_x: 13, chunk_y: 11,     spawn_x: 1744,  spawn_y: 1120} to checkpoints;
}