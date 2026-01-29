# Not implemented yet.
costumes "blank.png";

sounds "snd/*.mp3";
var music;
on "level_end" {
    stop_other_scripts;
    start_sound "clear";
}
on "mus_kirb" {
    music = "kirb";
    forever {
        play_sound_until_done "kirb";
    }
}

on "mus_switch" {
    music = "switch";
    stop_other_scripts;
    forever {
        play_sound_until_done "switch";
    }
}
