struct Solid{
    raw_name    = "",
    clone_name = "",
    prop1   = -1,
    prop2   = -1,
    prop3   = -1,
}

struct Projectile{
    type        = "",
    name        = "",
    lifetime    = 0,
    direction   = 0,
    x_position  = 0,
    y_position  = 0,
    xvel = 0,
    yvel = 0,
    follow = ""
}

enum Direction {
    None,
    Up,
    Right,
    Down,
    Left
}

enum BgLayerType {
    # This is for having multiple clones/sprites of one layer type each.
    None    = "root",
    Picture = "gfx",
    Solid   = "solid",
    Soft    = "soft",
    # maybe some gimmicky parallax stuff as well
    # or horizontal one-way walls 
}
# What could possibly go wrong?
# For more entities with colours that could interfere with this process, we could have all non-solids ghost themselves at the beginning of a tick.
# Note: up to 14 bits can be packed in a colour value; the top 5 bits of red and green and the top 4 bits of blue.
enum BgLayerTypeColour {
    None    = "0x000000",
    Picture = "0xf8f8f0",
    Solid   = "0x008000",
    Soft    = "0x008080",
    Spike   = "0x800000",
    Pogo    = "0x806000"
}

enum BgLayerTypeNumber {
    None = 32,
    Solid = 35,
    Soft = 61,
    Spike = 94,
    Pogo = 111,

}

enum BgLayerTypeBit {
    # This is for colliding entities.
    # None    = "0x000000",
    # Picture = "0xf8f8f0",
    Solid   = 1,
    Soft    = 2,
    Spike   = 4,
    Pogo    = 8,
}
struct PlayerEvent {
    type    = "",
    name    = "",
    sender  = "undefined",
}

struct MapInfo {
    # costume name stem of the map.
    map_name = "",
    # all coordinates measured in chunk size.
    # these work like python slices: [0:3] -> [0, 1, 2]
    map_left_edge   = 0,
    map_top_edge    = 0,
    map_right_edge  = 0,
    map_bottom_edge = 0,
    spawn_checkpoint_index = 1,
}

struct ChunkInfo {
    viewport_x = 0,
    viewport_y = 0,
    chunk_x    = 0,
    chunk_y    = 0, 
    
}

struct Checkpoint {
    # chunk coords are where the checkpoint will be triggered.
    chunk_x = 0,
    chunk_y = 0,
    # spawn coords are where the player will respawn from.
    spawn_x = 0,
    spawn_y = 0
}

struct CollisionCheck {
    sprite,
    costume,
    touching,
}