# note: coordinates are transformed at runtime.
proc step3_checkpoints {
    delete checkpoints;
    add Checkpoint {chunk_x: 0, chunk_y: 1,     spawn_x: 112,   spawn_y: 352} to checkpoints;
    add Checkpoint {chunk_x: 3, chunk_y: 0,     spawn_x: 992,   spawn_y: 192} to checkpoints;
    add Checkpoint {chunk_x: 6, chunk_y: 1,     spawn_x: 1648,  spawn_y: 360} to checkpoints;
    add Checkpoint {chunk_x: 3, chunk_y: 2,     spawn_x: 736,   spawn_y: 448} to checkpoints;
    add Checkpoint {chunk_x: 2, chunk_y: 3,     spawn_x: 624,   spawn_y: 752} to checkpoints;
    add Checkpoint {chunk_x: 4, chunk_y: 4,     spawn_x: 1184,  spawn_y: 864} to checkpoints;
    add Checkpoint {chunk_x: 7, chunk_y: 4,     spawn_x: 1856,  spawn_y: 912} to checkpoints;
    add Checkpoint {chunk_x: 1, chunk_y: 5,     spawn_x: 464,   spawn_y: 1040} to checkpoints;
    add Checkpoint {chunk_x: 6, chunk_y: 5,     spawn_x: 1744,  spawn_y: 1120} to checkpoints;
}